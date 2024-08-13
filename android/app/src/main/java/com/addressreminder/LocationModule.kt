package com.addressreminder

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Looper
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.facebook.react.bridge.Callback
import android.util.Log

//Modulo solicita as permissões e envia updates de localização.
class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val locationClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(reactContext)
    private val reactContext: ReactApplicationContext = reactContext
    private var numberOfListeners = 0

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun addListener(eventName: String) {
        numberOfListeners += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        numberOfListeners -= count
    }

    //Função para verificar as permissões e pedir caso precise.
    @ReactMethod
    fun checkPermissions(callback: Callback) {
        if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(currentActivity!!, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1)
            callback.invoke(false)
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && 
            ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(currentActivity!!, arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION), 1)
            callback.invoke(false)
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && 
            ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
            currentActivity!!, 
            arrayOf(Manifest.permission.POST_NOTIFICATIONS),
            1)
            callback.invoke(false)
        } else {
            callback.invoke(true)
        }
    }

    //Função que disponibiliza a localização atual do usuário.
    //O intervalo escolhido foi 5/2 segundos para manter uma maior fluidez no mapa.
    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun startLocationUpdates() {
        val locationRequest = LocationRequest.create().apply {
            interval = 5000L // 5 segundos
            fastestInterval = 2000L // 2 segundos
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }

        locationClient.requestLocationUpdates(locationRequest, object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                if (locationResult.locations.isNullOrEmpty()) return

                for (location in locationResult.locations) {
                    val params: WritableMap = Arguments.createMap().apply {
                        putDouble("latitude", location.latitude)
                        putDouble("longitude", location.longitude)
                    }
                    sendEvent("onLocationChanged", params)
                }
            }
        }, Looper.getMainLooper())
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, params)
    }
}
