package com.addressreminder

import android.content.Context
import android.util.Log
import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReactContext

//Responsavel por iniciar e fechar o serviço de notificações no background
class LocationServiceManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var isServiceRunning = false

    override fun getName(): String {
        return "LocationServiceManager"
    }

    @ReactMethod
    fun startService(pointsArray: ReadableArray) {
        val points = mutableListOf<Point>()
        for (i in 0 until pointsArray.size()) {
            val pointMap = pointsArray.getMap(i)
            val latitude = pointMap?.getDouble("latitude") ?: 0.0
            val longitude = pointMap?.getDouble("longitude") ?: 0.0
            points.add(Point(latitude, longitude))
        }

        // Criar Intent e iniciar o serviço
        val intent = Intent(reactApplicationContext, LocationService::class.java).apply {
            putParcelableArrayListExtra("points", ArrayList(points))
        }
        if (!isServiceRunning) {
            ContextCompat.startForegroundService(reactApplicationContext, intent)
            isServiceRunning = true
        }
    }

    @ReactMethod
    fun stopLocationService() {
        if (isServiceRunning) {
            val intent = Intent(reactApplicationContext, LocationService::class.java)
            reactApplicationContext.stopService(intent)
            isServiceRunning = false
        }
    }
}
