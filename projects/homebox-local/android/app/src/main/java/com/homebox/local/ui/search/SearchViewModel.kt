package com.homebox.local.ui.search

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.homebox.local.data.model.Item
import com.homebox.local.data.repository.ItemRepository
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

/**
 * 搜索页面 ViewModel
 * 负责处理搜索逻辑和状态管理
 */
@OptIn(FlowPreview::class)
class SearchViewModel(application: Application) : AndroidViewModel(application) {
    
    private val historyManager = SearchHistoryManager(application)
    private val repository = ItemRepository.getInstance(application)
    
    private val _state = MutableStateFlow(SearchState())
    val state: StateFlow<SearchState> = _state.asStateFlow()
    
    private var searchJob: Job? = null
    private val searchQuery = MutableStateFlow("")
    
    init {
        // 加载搜索历史
        loadSearchHistory()
        
        // 监听搜索查询，进行防抖处理
        viewModelScope.launch {
            searchQuery
                .debounce(300) // 300ms 防抖
                .filter { it.isNotBlank() }
                .collectLatest { query ->
                    performSearch(query)
                }
        }
    }
    
    /**
     * 处理搜索意图
     */
    fun handleIntent(intent: SearchIntent) {
        when (intent) {
            is SearchIntent.UpdateQuery -> {
                updateQuery(intent.query)
            }
            is SearchIntent.Search -> {
                search(intent.query)
            }
            is SearchIntent.ClearQuery -> {
                clearQuery()
            }
            is SearchIntent.RemoveHistoryItem -> {
                removeHistoryItem(intent.query)
            }
            is SearchIntent.ClearAllHistory -> {
                clearAllHistory()
            }
        }
    }
    
    /**
     * 更新搜索查询
     */
    private fun updateQuery(query: String) {
        _state.update { it.copy(
            searchQuery = query,
            showHistory = query.isBlank()
        )}
        
        if (query.isNotBlank()) {
            searchQuery.value = query
        } else {
            // 清空查询时清空结果
            _state.update { it.copy(searchResults = emptyList()) }
        }
    }
    
    /**
     * 执行搜索（手动触发）
     */
    private fun search(query: String) {
        if (query.isBlank()) return
        
        // 添加到搜索历史
        historyManager.addToHistory(query)
        loadSearchHistory()
        
        // 执行搜索
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            performSearch(query)
        }
    }
    
    /**
     * 执行模糊搜索
     */
    private suspend fun performSearch(query: String) {
        _state.update { it.copy(
            isSearching = true,
            errorMessage = null
        )}
        
        try {
            // 使用仓库进行模糊搜索
            val results = repository.searchItems(query)
            
            _state.update { it.copy(
                searchResults = results,
                isSearching = false,
                showHistory = false
            )}
        } catch (e: Exception) {
            _state.update { it.copy(
                isSearching = false,
                errorMessage = "搜索失败: ${e.message}"
            )}
        }
    }
    
    /**
     * 清空搜索查询
     */
    private fun clearQuery() {
        searchJob?.cancel()
        _state.update { SearchState(searchHistory = historyManager.getSearchHistory()) }
        searchQuery.value = ""
    }
    
    /**
     * 移除单条搜索历史
     */
    private fun removeHistoryItem(query: String) {
        historyManager.removeFromHistory(query)
        loadSearchHistory()
    }
    
    /**
     * 清空所有搜索历史
     */
    private fun clearAllHistory() {
        historyManager.clearAllHistory()
        loadSearchHistory()
    }
    
    /**
     * 加载搜索历史
     */
    private fun loadSearchHistory() {
        val history = historyManager.getSearchHistory()
        _state.update { it.copy(searchHistory = history) }
    }
}
