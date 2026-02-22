package com.homebox.local.ui.search

import com.homebox.local.data.model.Item

/**
 * 搜索页面状态
 */
data class SearchState(
    val searchQuery: String = "",
    val searchResults: List<Item> = emptyList(),
    val searchHistory: List<String> = emptyList(),
    val isSearching: Boolean = false,
    val showHistory: Boolean = true,
    val errorMessage: String? = null
)

/**
 * 搜索意图
 */
sealed class SearchIntent {
    data class UpdateQuery(val query: String) : SearchIntent()
    data class Search(val query: String) : SearchIntent()
    data class ClearHistory(val query: String) : SearchIntent()
    data class ClearAllHistory(val query: String) : SearchIntent()
    data object ClearAllHistory : SearchIntent()
    data class RemoveHistoryItem(val query: String) : SearchIntent()
    data object ClearQuery : SearchIntent()
}
