package com.homebox.local.ui.screens.item

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.homebox.local.data.repository.BoxRepository
import com.homebox.local.data.repository.ItemRepository
import com.homebox.local.data.repository.LocationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * 物品详情页面状态
 */
data class ItemDetailUiState(
    val itemWithLocation: ItemWithLocation? = null,
    val isLoading: Boolean = true,
    val error: String? = null
)

/**
 * 物品详情 ViewModel
 */
@HiltViewModel
class ItemDetailViewModel @Inject constructor(
    private val itemRepository: ItemRepository,
    private val boxRepository: BoxRepository,
    private val locationRepository: LocationRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ItemDetailUiState())
    val uiState: StateFlow<ItemDetailUiState> = _uiState.asStateFlow()

    /**
     * 加载物品详情
     */
    fun loadItem(itemId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            try {
                // 获取物品
                val item = itemRepository.getItemById(itemId)
                if (item == null) {
                    _uiState.update { 
                        it.copy(
                            isLoading = false,
                            error = "物品不存在"
                        )
                    }
                    return@launch
                }

                // 获取关联的箱子和位置
                val box = item.boxId.let { boxRepository.getBoxById(it) }
                val location = box?.locationId?.let { 
                    locationRepository.getLocationById(it) 
                }

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        itemWithLocation = ItemWithLocation(item, box, location)
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: "加载失败"
                    )
                }
            }
        }
    }
}
