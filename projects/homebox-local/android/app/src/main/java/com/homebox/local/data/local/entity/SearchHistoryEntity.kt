package com.homebox.local.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 搜索历史实体
 */
@Entity(tableName = "search_history")
data class SearchHistoryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    /** 搜索关键词 */
    val query: String,
    
    /** 搜索时间戳 */
    val searchedAt: Long
)
