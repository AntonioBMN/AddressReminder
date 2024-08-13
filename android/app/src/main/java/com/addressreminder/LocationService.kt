package com.addressreminder

import android.app.Notification
import android.app.NotificationChannel
import androidx.core.app.NotificationManagerCompat
import android.app.NotificationManager
import android.location.Location
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import kotlin.math.*
import android.util.Log
import kotlin.collections.mutableListOf
import android.content.Context

//Serviço responsavel por trackear o usuário e emitir notificações.
class LocationService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var locationCallback: LocationCallback
    private var points = mutableListOf<Point>()

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createLocationRequest()
        createLocationCallback()
        startLocationUpdates()
        createNotificationChannel()
    }

    //Recebe os pontos por meio do intent
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val points = intent?.getParcelableArrayListExtra<Point>("points")

        if (points != null) {
            this.points = points
        } else {
            Log.d("LocationService", "No points received")
        }
        return START_STICKY
    }

    //Cria a requisição da localização do usuário, a cada 30s/15s e tem o minimo de 10 metros de deslocamento também.
    private fun createLocationRequest() {
        locationRequest = LocationRequest.create().apply {
            interval = 30000 // 30 segundos
            fastestInterval = 15000 // 15 segundos
            smallestDisplacement = 10f // Mínimo de 10 metros antes de uma nova atualização
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
    }

    private fun createLocationCallback() {
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult ?: return
                for (location in locationResult.locations) {
                    checkProximityToPoints(location)
                }
            }
        }
    }

    private fun startLocationUpdates() {
        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
    }

    //Verifica se a distancia é menor que 30m e emite a notificação
    private fun checkProximityToPoints(currentLocation: Location): Boolean {
        for (point in this.points) {
            val pointLocation = Location("point")
            pointLocation.latitude = point.latitude
            pointLocation.longitude = point.longitude
            val distance = currentLocation.distanceTo(pointLocation)
            if (distance < 30) {
                sendNotification(this)
            }
        }
        return false
    }

    //Cria o canal de notificação que roda no background para enviar
    //notificações caso o usuário passe proximo a uma localização salva.
     private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "location_channel"
            val channelName = "Background Service"
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(channelId, channelName, importance)

            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)

            val notification = Notification.Builder(this, channelId)
                .setContentTitle("AddressReminder")
                .setContentText("Este aplicativo está trackeando sua localização")
                .setSmallIcon(R.drawable.download)
                .build()

            startForeground(1, notification)
        }
    }
    //Envia notificação
    fun sendNotification(context: Context) {
         val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val pendingIntent: PendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_MUTABLE
        )
        val builder = NotificationCompat.Builder(context, "location_channel")
            .setSmallIcon(R.drawable.download)
            .setContentTitle("AddressReminder")
            .setContentText("Parabéns voce está em um ponto")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        with(NotificationManagerCompat.from(context)) {
            notify(1, builder.build())
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
