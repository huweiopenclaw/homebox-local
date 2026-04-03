package com.homebox.local

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class HomeBoxApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Application initialization
    }
}
