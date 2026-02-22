package com.homebox.local.ui.screens.search

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.homebox.local.data.model.Item
import com.homebox.local.data.repository.ItemRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * 搜索页面 ViewModel
 * 使用 Hilt 依赖注入
 * 负责处理搜索逻辑和状态管理
 */
@OptIn(FlowPreview::class)
@HiltViewModel
class SearchViewModel @Inject constructor(
    application: Application
) : AndroidViewModel(application) {
    
    // 搜索查询
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    // 搜索结果
    private val _searchResults = MutableStateFlow<List<Item>>(emptyList())
    val searchResults: StateFlow<List<Item>> = _searchResults.asStateFlow()
    
    // 搜索历史
    private val _searchHistory = MutableStateFlow<List<String>>(emptyList())
    val searchHistory: StateFlow<List<String>> = _searchHistory.asStateFlow()
    
    // 搜索中状态
    private val _isSearching = MutableStateFlow(false)
    val isSearching: StateFlow<Boolean> = _isSearching.asStateFlow()
    
    // 搜索历史管理器
    private val historyManager = SearchHistoryManager(application)
    
    // 物品仓库
    private val itemRepository = ItemRepository.getInstance(application)
    
    // 搜索任务
    private var searchJob: Job? = null
    
    init {
        // 加载搜索历史
        loadSearchHistory()
        
        // 监听搜索查询，进行防抖处理
        viewModelScope.launch {
            _searchQuery
                .debounce(300) // 300ms 防抖
                .filter { it.isNotBlank() }
                .collectLatest { query ->
                    performSearch(query)
                }
        }
    }
    
    /**
     * 更新搜索查询
     */
    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        
        if (query.isBlank()) {
            // 清空查询时清空结果
            _searchResults.value = emptyList()
            _isSearching.value = false
        }
    }
    
    /**
     * 清空搜索
     */
    fun clearSearch() {
        searchJob?.cancel()
        _searchQuery.value = ""
        _searchResults.value = emptyList()
        _isSearching.value = false
    }
    
    /**
     * 执行搜索（手动触发）
     */
    fun performSearch(query: String) {
        if (query.isBlank()) return
        
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            performSearchInternal(query)
        }
    }
    
    /**
     * 执行模糊搜索
     */
    private suspend fun performSearchInternal(query: String) {
        _isSearching.value = true
        
        try {
            // 使用仓库进行模糊搜索
            val results = itemRepository.searchItems(query)
            _searchResults.value = results
        } catch (e: Exception) {
            // 搜索失败，保持空结果
            _searchResults.value = emptyList()
        } finally {
            _isSearching.value = false
        }
    }
    
    /**
     * 添加到搜索历史
     */
    fun addToHistory(query: String) {
        if (query.isBlank()) return
        historyManager.addToHistory(query)
        loadSearchHistory()
    }
    
    /**
     * 移除单条搜索历史
     */
    fun removeFromHistory(query: String) {
        historyManager.removeFromHistory(query)
        loadSearchHistory()
    }
    
    /**
     * 清空所有搜索历史
     */
    fun clearHistory() {
        historyManager.clearAllHistory()
        loadSearchHistory()
    }
    
    /**
     * 加载搜索历史
     */
    private fun loadSearchHistory() {
        _searchHistory.value = historyManager.getSearchHistory()
    }
}

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
