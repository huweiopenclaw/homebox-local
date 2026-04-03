package com.homebox.local.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * 箱子实体
 * 用于存放多个物品的容器
 */
@Entity(
    tableName = "boxes",
    foreignKeys = [
        ForeignKey(
            entity = LocationEntity::class,
            parentColumns = ["id"],
            childColumns = ["locationId"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [Index("locationId")]
)
data class BoxEntity(
    @PrimaryKey
    val id: String,
    
    /** 箱子名称 */
    val name: String,
    
    /** 箱子描述 */
    val description: String? = null,
    
    /** 所属位置ID */
    val locationId: String? = null,
    
    /** 照片路径 */
    val photoPath: String? = null,
    
    /** 创建时间戳 */
    val createdAt: Long,
    
    /** 更新时间戳 */
    val updatedAt: Long
)
