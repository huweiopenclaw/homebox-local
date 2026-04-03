package com.homebox.local.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * 物品实体
 * 单个物品的详细信息
 */
@Entity(
    tableName = "items",
    foreignKeys = [
        ForeignKey(
            entity = BoxEntity::class,
            parentColumns = ["id"],
            childColumns = ["boxId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("boxId"), Index("category"), Index("name")]
)
data class ItemEntity(
    @PrimaryKey
    val id: String,
    
    /** 所属箱子ID */
    val boxId: String,
    
    /** 物品名称 */
    val name: String,
    
    /** 物品分类，如：电子设备、衣物、书籍 */
    val category: String? = null,
    
    /** 数量 */
    val quantity: Int = 1,
    
    /** 照片路径 */
    val photoPath: String? = null,
    
    /** 备注信息 */
    val notes: String? = null,
    
    /** 标签列表，JSON格式存储，如：["重要", "常用"] */
    val tags: String? = null,
    
    /** 创建时间戳 */
    val createdAt: Long,
    
    /** 更新时间戳 */
    val updatedAt: Long
)
