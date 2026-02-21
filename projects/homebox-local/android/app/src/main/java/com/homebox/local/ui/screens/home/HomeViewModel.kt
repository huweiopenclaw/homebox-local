package com.homebox.local.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    // TODO: 注入 Repository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    
    init {
        loadData()
    }
    
    private fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            // TODO: 从 Repository 加载数据
            // 暂时使用模拟数据
            _uiState.update { 
                it.copy(
                    boxCount = 5,
                    itemCount = 23,
                    locationCount = 3,
                    recentBoxes = listOf(
                        Box("1", "冬季衣物-1", "卧室衣柜"),
                        Box("2", "电子产品配件", "书房抽屉"),
                        Box("3", "季节装饰", "储藏室")
                    ),
                    isLoading = false
                )
            }
        }
    }
    
    fun refresh() {
        loadData()
    }
}
