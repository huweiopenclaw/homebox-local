package com.homebox.local.data.local.dao

import androidx.room.*
import com.homebox.local.data.local.entity.BoxEntity
import kotlinx.coroutines.flow.Flow

/**
 * 箱子数据访问对象
 */
@Dao
interface BoxDao {
    
    /**
     * 插入箱子
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(box: BoxEntity)
    
    /**
     * 批量插入箱子
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(boxes: List<BoxEntity>)
    
    /**
     * 更新箱子
     */
    @Update
    suspend fun update(box: BoxEntity)
    
    /**
     * 删除箱子
     */
    @Delete
    suspend fun delete(box: BoxEntity)
    
    /**
     * 根据ID删除箱子
     */
    @Query("DELETE FROM boxes WHERE id = :id")
    suspend fun deleteById(id: String)
    
    /**
     * 根据ID获取箱子
     */
    @Query("SELECT * FROM boxes WHERE id = :id")
    suspend fun getById(id: String): BoxEntity?
    
    /**
     * 根据ID获取箱子（Flow）
     */
    @Query("SELECT * FROM boxes WHERE id = :id")
    fun getByIdFlow(id: String): Flow<BoxEntity?>
    
    /**
     * 获取所有箱子
     */
    @Query("SELECT * FROM boxes ORDER BY updatedAt DESC")
    fun getAll(): Flow<List<BoxEntity>>
    
    /**
     * 根据位置ID获取箱子列表
     */
    @Query("SELECT * FROM boxes WHERE locationId = :locationId ORDER BY name")
    fun getByLocation(locationId: String): Flow<List<BoxEntity>>
    
    /**
     * 获取没有位置的箱子
     */
    @Query("SELECT * FROM boxes WHERE locationId IS NULL ORDER BY name")
    fun getWithoutLocation(): Flow<List<BoxEntity>>
    
    /**
     * 搜索箱子
     */
    @Query("""
        SELECT * FROM boxes 
        WHERE name LIKE '%' || :query || '%' 
           OR description LIKE '%' || :query || '%'
        ORDER BY updatedAt DESC
    """)
    fun search(query: String): Flow<List<BoxEntity>>
    
    /**
     * 更新箱子的位置
     */
    @Query("UPDATE boxes SET locationId = :locationId, updatedAt = :updatedAt WHERE id = :boxId")
    suspend fun updateLocation(boxId: String, locationId: String?, updatedAt: Long)
    
    /**
     * 获取箱子总数
     */
    @Query("SELECT COUNT(*) FROM boxes")
    fun getCount(): Flow<Int>
    
    /**
     * 获取最近更新的箱子
     */
    @Query("SELECT * FROM boxes ORDER BY updatedAt DESC LIMIT :limit")
    fun getRecent(limit: Int = 10): Flow<List<BoxEntity>>
}
