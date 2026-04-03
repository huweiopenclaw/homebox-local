package com.homebox.local.data.local.dao

import androidx.room.*
import com.homebox.local.data.local.entity.SearchHistoryEntity
import kotlinx.coroutines.flow.Flow

/**
 * 搜索历史数据访问对象
 */
@Dao
interface SearchHistoryDao {
    
    /**
     * 插入搜索历史
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(history: SearchHistoryEntity)
    
    /**
     * 删除搜索历史
     */
    @Delete
    suspend fun delete(history: SearchHistoryEntity)
    
    /**
     * 清空所有搜索历史
     */
    @Query("DELETE FROM search_history")
    suspend fun deleteAll()
    
    /**
     * 获取最近的搜索历史
     */
    @Query("SELECT * FROM search_history ORDER BY searchedAt DESC LIMIT :limit")
    fun getRecent(limit: Int = 20): Flow<List<SearchHistoryEntity>>
    
    /**
     * 根据关键词删除搜索历史
     */
    @Query("DELETE FROM search_history WHERE query = :query")
    suspend fun deleteByQuery(query: String)
}
