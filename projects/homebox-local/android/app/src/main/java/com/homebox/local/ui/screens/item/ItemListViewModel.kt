package com.homebox.local.ui.screens.item

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.homebox.local.data.local.entity.BoxEntity
import com.homebox.local.data.local.entity.ItemEntity
import com.homebox.local.data.local.entity.LocationEntity
import com.homebox.local.data.repository.BoxRepository
import com.homebox.local.data.repository.ItemRepository
import com.homebox.local.data.repository.LocationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * 物品列表页面状态
 */
data class ItemListUiState(
    val items: List<ItemWithLocation> = emptyList(),
    val categories: List<String> = emptyList(),
    val selectedCategory: String? = null,
    val searchQuery: String = "",
    val isLoading: Boolean = true
)

/**
 * 物品及其位置信息的组合数据类
 */
data class ItemWithLocation(
    val item: ItemEntity,
    val box: BoxEntity?,
    val location: LocationEntity?
)

/**
 * 物品列表 ViewModel
 */
@HiltViewModel
class ItemListViewModel @Inject constructor(
    private val itemRepository: ItemRepository,
    private val boxRepository: BoxRepository,
    private val locationRepository: LocationRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ItemListUiState())
    val uiState: StateFlow<ItemListUiState> = _uiState.asStateFlow()

    // 选中的分类
    private val _selectedCategory = MutableStateFlow<String?>(null)

    // 搜索查询
    private val _searchQuery = MutableStateFlow("")

    init {
        loadData()
    }

    /**
     * 加载所有数据
     */
    private fun loadData() {
        viewModelScope.launch {
            // 加载分类列表
            itemRepository.getAllCategories()
                .catch { e -> 
                    _uiState.update { it.copy(isLoading = false) }
                }
                .collect { categories ->
                    _uiState.update { it.copy(categories = categories) }
                }
        }

        viewModelScope.launch {
            // 组合数据流：物品 -> 箱子 -> 位置
            combine(
                itemRepository.getAllItems(),
                boxRepository.getAllBoxes(),
                locationRepository.getAllLocations(),
                _selectedCategory,
                _searchQuery
            ) { items, boxes, locations, category, query ->
                // 过滤和组合数据
                var filteredItems = items

                // 按分类筛选
                if (category != null) {
                    filteredItems = filteredItems.filter { it.category == category }
                }

                // 按搜索查询筛选
                if (query.isNotBlank()) {
                    filteredItems = filteredItems.filter { item ->
                        item.name.contains(query, ignoreCase = true) ||
                        item.category?.contains(query, ignoreCase = true) == true ||
                        item.notes?.contains(query, ignoreCase = true) == true
                    }
                }

                // 组合物品、箱子和位置信息
                filteredItems.map { item ->
                    val box = boxes.find { it.id == item.boxId }
                    val location = box?.locationId?.let { locId ->
                        locations.find { it.id == locId }
                    }
                    ItemWithLocation(item, box, location)
                }
            }
            .catch { e ->
                _uiState.update { it.copy(isLoading = false) }
            }
            .collect { itemsWithLocation ->
                _uiState.update { 
                    it.copy(
                        items = itemsWithLocation,
                        isLoading = false
                    )
                }
            }
        }
    }

    /**
     * 选择分类筛选
     */
    fun selectCategory(category: String?) {
        _selectedCategory.value = category
        _uiState.update { it.copy(selectedCategory = category) }
    }

    /**
     * 更新搜索查询
     */
    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        _uiState.update { it.copy(searchQuery = query) }
    }

    /**
     * 清除筛选
     */
    fun clearFilters() {
        _selectedCategory.value = null
        _searchQuery.value = ""
        _uiState.update { 
            it.copy(
                selectedCategory = null,
                searchQuery = ""
            )
        }
    }
}
