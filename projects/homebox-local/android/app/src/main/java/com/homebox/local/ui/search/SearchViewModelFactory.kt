package com.homebox.local.ui.search

import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

/**
 * SearchViewModel 工厂类
 * 用于创建 SearchViewModel 实例
 */
class SearchViewModelFactory(
    private val application: Application
) : ViewModelProvider.Factory {
    
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SearchViewModel::class.java)) {
            return SearchViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
    
    companion object {
        @Volatile
        private var instance: SearchViewModelFactory? = null
        
        fun getInstance(application: Application): SearchViewModelFactory {
            return instance ?: synchronized(this) {
                instance ?: SearchViewModelFactory(application).also { instance = it }
            }
        }
    }
}
