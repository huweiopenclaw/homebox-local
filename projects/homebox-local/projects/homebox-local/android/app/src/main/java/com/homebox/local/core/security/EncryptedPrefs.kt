package com.homebox.local.core.security

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.homebox.local.data.remote.AIConfig
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * 加密偏好设置
 * 用于安全存储 API Key 等敏感信息
 */
@Singleton
class EncryptedPrefs @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "homebox_secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveAPIKey(key: String) {
        sharedPreferences.edit().putString(KEY_API_KEY, key).apply()
    }

    fun getAPIKey(): String? {
        return sharedPreferences.getString(KEY_API_KEY, null)
    }

    fun saveAIConfig(config: AIConfig) {
        val json = Json.encodeToString(config)
        sharedPreferences.edit().putString(KEY_AI_CONFIG, json).apply()
    }

    fun loadAIConfig(): AIConfig? {
        val json = sharedPreferences.getString(KEY_AI_CONFIG, null) ?: return null
        return try {
            Json.decodeFromString(json)
        } catch (e: Exception) {
            null
        }
    }

    fun clearAll() {
        sharedPreferences.edit().clear().apply()
    }

    companion object {
        private const val KEY_API_KEY = "api_key"
        private const val KEY_AI_CONFIG = "ai_config"
    }
}
