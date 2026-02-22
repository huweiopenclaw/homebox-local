package com.homebox.local.data.model

import java.util.UUID

/**
 * 物品数据模型
 */
data class Item(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String? = null,
    val location: String? = null,
    val categoryId: String? = null,
    val quantity: Int = 1,
    val tags: List<String> = emptyList(),
    val imageUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val notes: String? = null
) {
    /**
     * 检查物品是否匹配搜索查询（模糊搜索）
     */
    fun matchesQuery(query: String): Boolean {
        val lowerQuery = query.lowercase().trim()
        return name.lowercase().contains(lowerQuery) ||
               description?.lowercase()?.contains(lowerQuery) == true ||
               location?.lowercase()?.contains(lowerQuery) == true ||
               tags.any { it.lowercase().contains(lowerQuery) } ||
               notes?.lowercase()?.contains(lowerQuery) == true
    }
}
