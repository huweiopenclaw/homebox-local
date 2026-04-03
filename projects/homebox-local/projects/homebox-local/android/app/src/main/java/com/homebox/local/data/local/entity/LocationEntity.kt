package com.homebox.local.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 位置实体
 * 表示物品存放的具体位置（房间 -> 家具 -> 位置）
 */
@Entity(tableName = "locations")
data class LocationEntity(
    @PrimaryKey
    val id: String,
    
    /** 房间名称，如：客厅、卧室、厨房 */
    val room: String,
    
    /** 家具名称，如：电视柜、衣柜、书架 */
    val furniture: String,
    
    /** 具体位置描述，如：上层、左侧、第二格 */
    val position: String,
    
    /** 照片路径 */
    val photoPath: String? = null,
    
    /** 备注信息 */
    val notes: String? = null,
    
    /** 创建时间戳 */
    val createdAt: Long
)
