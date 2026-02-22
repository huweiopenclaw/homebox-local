package com.homebox.local.ui.search

import android.content.Context
import android.content.SharedPreferences

/**
 * 搜索历史记录管理器
 * 使用 SharedPreferences 存储搜索历史
 */
class SearchHistoryManager(context: Context) {
    
    private val prefs: SharedPreferences = context.getSharedPreferences(
        PREFS_NAME, Context.MODE_PRIVATE
    )
    
    /**
     * 获取搜索历史列表
     */
    fun getSearchHistory(): List<String> {
        val historySet = prefs.getStringSet(KEY_SEARCH_HISTORY, emptySet()) ?: emptySet()
        return historySet.toList().sortedByDescending { 
            prefs.getLong("${KEY_HISTORY_TIME}$it", 0L) 
        }
    }
    
    /**
     * 添加搜索记录到历史
     */
    fun addToHistory(query: String) {
        if (query.isBlank()) return
        
        val history = getSearchHistory().toMutableList()
        
        // 如果已存在，先移除旧的
        history.remove(query)
        
        // 添加到开头
        history.add(0, query)
        
        // 保持最多 MAX_HISTORY_SIZE 条记录
        val trimmedHistory = history.take(MAX_HISTORY_SIZE)
        
        // 保存
        val historySet = trimmedHistory.toSet()
        prefs.edit()
            .putStringSet(KEY_SEARCH_HISTORY, historySet)
            .putLong("${KEY_HISTORY_TIME}$query", System.currentTimeMillis())
            .apply()
    }
    
    /**
     * 移除单条搜索历史
     */
    fun removeFromHistory(query: String) {
        val history = getSearchHistory().toMutableList()
        history.remove(query)
        
        prefs.edit()
            .putStringSet(KEY_SEARCH_HISTORY, history.toSet())
            .remove("${KEY_HISTORY_TIME}$query")
            .apply()
    }
    
    /**
     * 清空所有搜索历史
     */
    fun clearAllHistory() {
        val history = getSearchHistory()
        val editor = prefs.edit()
        
        history.forEach { query ->
            editor.remove("${KEY_HISTORY_TIME}$query")
        }
        
        editor.remove(KEY_SEARCH_HISTORY).apply()
    }
    
    companion object {
        private const val PREFS_NAME = "search_history_prefs"
        private const val KEY_SEARCH_HISTORY = "search_history"
        private const val KEY_HISTORY_TIME = "search_history_time_"
        private const val MAX_HISTORY_SIZE = 20
    }
}
