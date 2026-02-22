package com.homebox.local.data.repository

import android.app.Application
import com.homebox.local.data.model.Item
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * 物品数据仓库
 * 负责物品的增删改查和搜索功能
 */
class ItemRepository private constructor(
    private val application: Application
) {
    // TODO: 替换为实际的数据库或数据源
    // 这里使用内存列表作为示例
    private val items = mutableListOf<Item>()
    
    /**
     * 搜索物品（模糊搜索）
     * @param query 搜索关键词
     * @return 匹配的物品列表
     */
    suspend fun searchItems(query: String): List<Item> = withContext(Dispatchers.IO) {
        if (query.isBlank()) {
            return@withContext emptyList()
        }
        
        // 执行模糊搜索
        items.filter { item ->
            item.matchesQuery(query)
        }
    }
    
    /**
     * 获取所有物品
     */
    suspend fun getAllItems(): List<Item> = withContext(Dispatchers.IO) {
        items.toList()
    }
    
    /**
     * 根据ID获取物品
     */
    suspend fun getItemById(id: String): Item? = withContext(Dispatchers.IO) {
        items.find { it.id == id }
    }
    
    /**
     * 添加物品
     */
    suspend fun insertItem(item: Item) = withContext(Dispatchers.IO) {
        items.add(item)
    }
    
    /**
     * 更新物品
     */
    suspend fun updateItem(item: Item) = withContext(Dispatchers.IO) {
        val index = items.indexOfFirst { it.id == item.id }
        if (index >= 0) {
            items[index] = item.copy(updatedAt = System.currentTimeMillis())
        }
    }
    
    /**
     * 删除物品
     */
    suspend fun deleteItem(item: Item) = withContext(Dispatchers.IO) {
        items.remove(item)
    }
    
    /**
     * 根据ID删除物品
     */
    suspend fun deleteItemById(id: String) = withContext(Dispatchers.IO) {
        items.removeAll { it.id == id }
    }
    
    /**
     * 根据分类获取物品
     */
    suspend fun getItemsByCategory(categoryId: String): List<Item> = withContext(Dispatchers.IO) {
        items.filter { it.categoryId == categoryId }
    }
    
    /**
     * 根据位置获取物品
     */
    suspend fun getItemsByLocation(location: String): List<Item> = withContext(Dispatchers.IO) {
        items.filter { it.location?.contains(location, ignoreCase = true) == true }
    }
    
    companion object {
        @Volatile
        private var instance: ItemRepository? = null
        
        fun getInstance(application: Application): ItemRepository {
            return instance ?: synchronized(this) {
                instance ?: ItemRepository(application).also { instance = it }
            }
        }
    }
}
