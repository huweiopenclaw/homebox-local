package com.homebox.local.data.local.dao

import androidx.room.*
import com.homebox.local.data.local.entity.ItemEntity
import kotlinx.coroutines.flow.Flow

/**
 * 物品数据访问对象
 */
@Dao
interface ItemDao {
    
    /**
     * 插入物品
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: ItemEntity)
    
    /**
     * 批量插入物品
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<ItemEntity>)
    
    /**
     * 更新物品
     */
    @Update
    suspend fun update(item: ItemEntity)
    
    /**
     * 删除物品
     */
    @Delete
    suspend fun delete(item: ItemEntity)
    
    /**
     * 根据ID删除物品
     */
    @Query("DELETE FROM items WHERE id = :id")
    suspend fun deleteById(id: String)
    
    /**
     * 删除箱子中的所有物品
     */
    @Query("DELETE FROM items WHERE boxId = :boxId")
    suspend fun deleteByBoxId(boxId: String)
    
    /**
     * 根据ID获取物品
     */
    @Query("SELECT * FROM items WHERE id = :id")
    suspend fun getById(id: String): ItemEntity?
    
    /**
     * 根据ID获取物品（Flow）
     */
    @Query("SELECT * FROM items WHERE id = :id")
    fun getByIdFlow(id: String): Flow<ItemEntity?>
    
    /**
     * 获取所有物品
     */
    @Query("SELECT * FROM items ORDER BY updatedAt DESC")
    fun getAll(): Flow<List<ItemEntity>>
    
    /**
     * 根据箱子ID获取物品列表
     */
    @Query("SELECT * FROM items WHERE boxId = :boxId ORDER BY name")
    fun getByBoxId(boxId: String): Flow<List<ItemEntity>>
    
    /**
     * 根据分类获取物品列表
     */
    @Query("SELECT * FROM items WHERE category = :category ORDER BY name")
    fun getByCategory(category: String): Flow<List<ItemEntity>>
    
    /**
     * 获取所有分类（去重）
     */
    @Query("SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category")
    fun getAllCategories(): Flow<List<String>>
    
    /**
     * 搜索物品（名称、分类、备注、标签）
     */
    @Query("""
        SELECT * FROM items 
        WHERE name LIKE '%' || :query || '%' 
           OR category LIKE '%' || :query || '%' 
           OR notes LIKE '%' || :query || '%'
           OR tags LIKE '%' || :query || '%'
        ORDER BY updatedAt DESC
    """)
    fun search(query: String): Flow<List<ItemEntity>>
    
    /**
     * 根据标签搜索物品
     */
    @Query("SELECT * FROM items WHERE tags LIKE '%' || :tag || '%' ORDER BY name")
    fun getByTag(tag: String): Flow<List<ItemEntity>>
    
    /**
     * 更新物品数量
     */
    @Query("UPDATE items SET quantity = :quantity, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateQuantity(id: String, quantity: Int, updatedAt: Long)
    
    /**
     * 更新物品所属箱子
     */
    @Query("UPDATE items SET boxId = :boxId, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateBoxId(id: String, boxId: String, updatedAt: Long)
    
    /**
     * 获取物品总数
     */
    @Query("SELECT COUNT(*) FROM items")
    fun getCount(): Flow<Int>
    
    /**
     * 获取物品总数量（含每个物品的quantity）
     */
    @Query("SELECT SUM(quantity) FROM items")
    fun getTotalQuantity(): Flow<Int?>
    
    /**
     * 获取最近添加的物品
     */
    @Query("SELECT * FROM items ORDER BY createdAt DESC LIMIT :limit")
    fun getRecent(limit: Int = 10): Flow<List<ItemEntity>>
    
    /**
     * 获取指定箱子中的物品数量
     */
    @Query("SELECT COUNT(*) FROM items WHERE boxId = :boxId")
    fun getCountByBoxId(boxId: String): Flow<Int>
}
