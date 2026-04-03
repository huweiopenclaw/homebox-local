package com.homebox.local.data.local.dao

import androidx.room.*
import com.homebox.local.data.local.entity.LocationEntity
import kotlinx.coroutines.flow.Flow

/**
 * 位置数据访问对象
 */
@Dao
interface LocationDao {
    
    /**
     * 插入位置
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(location: LocationEntity)
    
    /**
     * 批量插入位置
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(locations: List<LocationEntity>)
    
    /**
     * 更新位置
     */
    @Update
    suspend fun update(location: LocationEntity)
    
    /**
     * 删除位置
     */
    @Delete
    suspend fun delete(location: LocationEntity)
    
    /**
     * 根据ID删除位置
     */
    @Query("DELETE FROM locations WHERE id = :id")
    suspend fun deleteById(id: String)
    
    /**
     * 根据ID获取位置
     */
    @Query("SELECT * FROM locations WHERE id = :id")
    suspend fun getById(id: String): LocationEntity?
    
    /**
     * 获取所有位置
     */
    @Query("SELECT * FROM locations ORDER BY room, furniture, position")
    fun getAll(): Flow<List<LocationEntity>>
    
    /**
     * 根据房间获取位置列表
     */
    @Query("SELECT * FROM locations WHERE room = :room ORDER BY furniture, position")
    fun getByRoom(room: String): Flow<List<LocationEntity>>
    
    /**
     * 获取所有房间列表（去重）
     */
    @Query("SELECT DISTINCT room FROM locations ORDER BY room")
    fun getAllRooms(): Flow<List<String>>
    
    /**
     * 搜索位置
     */
    @Query("""
        SELECT * FROM locations 
        WHERE room LIKE '%' || :query || '%' 
           OR furniture LIKE '%' || :query || '%' 
           OR position LIKE '%' || :query || '%'
           OR notes LIKE '%' || :query || '%'
        ORDER BY room, furniture, position
    """)
    fun search(query: String): Flow<List<LocationEntity>>
    
    /**
     * 获取位置总数
     */
    @Query("SELECT COUNT(*) FROM locations")
    fun getCount(): Flow<Int>
}
