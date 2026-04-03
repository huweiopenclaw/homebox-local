package com.homebox.local.data.repository

import com.homebox.local.data.local.dao.ItemDao
import com.homebox.local.data.local.entity.ItemEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * 物品数据仓库
 * 负责物品相关的数据操作
 */
@Singleton
class ItemRepository @Inject constructor(
    private val itemDao: ItemDao
) {
    /**
     * 获取所有物品
     */
    fun getAllItems(): Flow<List<ItemEntity>> = itemDao.getAll()
    
    /**
     * 根据ID获取物品
     */
    suspend fun getItemById(id: String): ItemEntity? = itemDao.getById(id)
    
    /**
     * 根据ID获取物品（Flow）
     */
    fun getItemByIdFlow(id: String): Flow<ItemEntity?> = itemDao.getByIdFlow(id)
    
    /**
     * 根据箱子ID获取物品
     */
    fun getItemsByBoxId(boxId: String): Flow<List<ItemEntity>> = itemDao.getByBoxId(boxId)
    
    /**
     * 根据分类获取物品
     */
    fun getItemsByCategory(category: String): Flow<List<ItemEntity>> = 
        itemDao.getByCategory(category)
    
    /**
     * 获取所有分类
     */
    fun getAllCategories(): Flow<List<String>> = itemDao.getAllCategories()
    
    /**
     * 搜索物品
     */
    fun searchItems(query: String): Flow<List<ItemEntity>> = itemDao.search(query)
    
    /**
     * 根据标签获取物品
     */
    fun getItemsByTag(tag: String): Flow<List<ItemEntity>> = itemDao.getByTag(tag)
    
    /**
     * 获取最近添加的物品
     */
    fun getRecentItems(limit: Int = 10): Flow<List<ItemEntity>> = itemDao.getRecent(limit)
    
    /**
     * 获取物品总数
     */
    fun getItemCount(): Flow<Int> = itemDao.getCount()
    
    /**
     * 获取物品总数量（含quantity字段）
     */
    fun getTotalItemQuantity(): Flow<Int?> = itemDao.getTotalQuantity()
    
    /**
     * 获取指定箱子中的物品数量
     */
    fun getItemCountByBoxId(boxId: String): Flow<Int> = itemDao.getCountByBoxId(boxId)
    
    /**
     * 添加物品
     * @param boxId 所属箱子ID
     * @param name 物品名称
     * @param category 分类
     * @param quantity 数量
     * @param photoPath 照片路径
     * @param notes 备注
     * @param tags 标签（JSON格式）
     * @return 创建的物品实体
     */
    suspend fun addItem(
        boxId: String,
        name: String,
        category: String? = null,
        quantity: Int = 1,
        photoPath: String? = null,
        notes: String? = null,
        tags: String? = null
    ): ItemEntity {
        val currentTime = System.currentTimeMillis()
        val item = ItemEntity(
            id = UUID.randomUUID().toString(),
            boxId = boxId,
            name = name,
            category = category,
            quantity = quantity,
            photoPath = photoPath,
            notes = notes,
            tags = tags,
            createdAt = currentTime,
            updatedAt = currentTime
        )
        itemDao.insert(item)
        return item
    }
    
    /**
     * 批量添加物品
     * @param items 物品列表（需要包含boxId）
     */
    suspend fun addItems(items: List<ItemEntity>) {
        val currentTime = System.currentTimeMillis()
        val itemsWithTimestamp = items.map { item ->
            item.copy(
                id = if (item.id.isEmpty()) UUID.randomUUID().toString() else item.id,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        }
        itemDao.insertAll(itemsWithTimestamp)
    }
    
    /**
     * 更新物品
     */
    suspend fun updateItem(item: ItemEntity) {
        val updatedItem = item.copy(updatedAt = System.currentTimeMillis())
        itemDao.update(updatedItem)
    }
    
    /**
     * 更新物品基本信息
     */
    suspend fun updateItemInfo(
        id: String,
        name: String,
        category: String?,
        notes: String?,
        tags: String?
    ) {
        val item = itemDao.getById(id) ?: return
        updateItem(item.copy(
            name = name,
            category = category,
            notes = notes,
            tags = tags
        ))
    }
    
    /**
     * 更新物品数量
     */
    suspend fun updateItemQuantity(id: String, quantity: Int) {
        itemDao.updateQuantity(id, quantity, System.currentTimeMillis())
    }
    
    /**
     * 增加物品数量
     */
    suspend fun incrementItemQuantity(id: String, amount: Int = 1) {
        val item = itemDao.getById(id) ?: return
        updateItemQuantity(id, item.quantity + amount)
    }
    
    /**
     * 减少物品数量
     */
    suspend fun decrementItemQuantity(id: String, amount: Int = 1) {
        val item = itemDao.getById(id) ?: return
        val newQuantity = (item.quantity - amount).coerceAtLeast(0)
        updateItemQuantity(id, newQuantity)
    }
    
    /**
     * 移动物品到其他箱子
     */
    suspend fun moveItemToBox(itemId: String, newBoxId: String) {
        itemDao.updateBoxId(itemId, newBoxId, System.currentTimeMillis())
    }
    
    /**
     * 更新物品照片
     */
    suspend fun updateItemPhoto(itemId: String, photoPath: String?) {
        val item = itemDao.getById(itemId) ?: return
        updateItem(item.copy(photoPath = photoPath))
    }
    
    /**
     * 删除物品
     */
    suspend fun deleteItem(item: ItemEntity) {
        itemDao.delete(item)
    }
    
    /**
     * 根据ID删除物品
     */
    suspend fun deleteItemById(id: String) {
        itemDao.deleteById(id)
    }
    
    /**
     * 删除箱子中的所有物品
     */
    suspend fun deleteItemsByBoxId(boxId: String) {
        itemDao.deleteByBoxId(boxId)
    }
}
