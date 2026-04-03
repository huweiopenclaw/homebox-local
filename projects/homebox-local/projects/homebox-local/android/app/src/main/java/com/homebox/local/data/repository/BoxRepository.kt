package com.homebox.local.data.repository

import com.homebox.local.data.local.dao.BoxDao
import com.homebox.local.data.local.dao.ItemDao
import com.homebox.local.data.local.entity.BoxEntity
import com.homebox.local.data.local.entity.ItemEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * 箱子数据仓库
 * 负责箱子相关的数据操作
 */
@Singleton
class BoxRepository @Inject constructor(
    private val boxDao: BoxDao,
    private val itemDao: ItemDao
) {
    /**
     * 获取所有箱子
     */
    fun getAllBoxes(): Flow<List<BoxEntity>> = boxDao.getAll()
    
    /**
     * 根据ID获取箱子
     */
    suspend fun getBoxById(id: String): BoxEntity? = boxDao.getById(id)
    
    /**
     * 根据ID获取箱子（Flow）
     */
    fun getBoxByIdFlow(id: String): Flow<BoxEntity?> = boxDao.getByIdFlow(id)
    
    /**
     * 根据位置获取箱子
     */
    fun getBoxesByLocation(locationId: String): Flow<List<BoxEntity>> = 
        boxDao.getByLocation(locationId)
    
    /**
     * 获取未分配位置的箱子
     */
    fun getBoxesWithoutLocation(): Flow<List<BoxEntity>> = boxDao.getWithoutLocation()
    
    /**
     * 搜索箱子
     */
    fun searchBoxes(query: String): Flow<List<BoxEntity>> = boxDao.search(query)
    
    /**
     * 获取最近更新的箱子
     */
    fun getRecentBoxes(limit: Int = 10): Flow<List<BoxEntity>> = boxDao.getRecent(limit)
    
    /**
     * 获取箱子总数
     */
    fun getBoxCount(): Flow<Int> = boxDao.getCount()
    
    /**
     * 添加箱子
     * @param name 箱子名称
     * @param description 描述
     * @param locationId 位置ID
     * @param photoPath 照片路径
     * @return 创建的箱子实体
     */
    suspend fun addBox(
        name: String,
        description: String? = null,
        locationId: String? = null,
        photoPath: String? = null
    ): BoxEntity {
        val currentTime = System.currentTimeMillis()
        val box = BoxEntity(
            id = UUID.randomUUID().toString(),
            name = name,
            description = description,
            locationId = locationId,
            photoPath = photoPath,
            createdAt = currentTime,
            updatedAt = currentTime
        )
        boxDao.insert(box)
        return box
    }
    
    /**
     * 添加箱子（带物品）
     * @param name 箱子名称
     * @param items 物品列表
     * @param description 描述
     * @param locationId 位置ID
     * @param photoPath 照片路径
     * @return 创建的箱子实体
     */
    suspend fun addBoxWithItems(
        name: String,
        items: List<ItemEntity>,
        description: String? = null,
        locationId: String? = null,
        photoPath: String? = null
    ): BoxEntity {
        val box = addBox(name, description, locationId, photoPath)
        
        // 更新物品的 boxId 并插入
        val currentTime = System.currentTimeMillis()
        val itemsWithBoxId = items.map { item ->
            item.copy(
                boxId = box.id,
                createdAt = currentTime,
                updatedAt = currentTime
            )
        }
        itemDao.insertAll(itemsWithBoxId)
        
        return box
    }
    
    /**
     * 更新箱子
     */
    suspend fun updateBox(box: BoxEntity) {
        val updatedBox = box.copy(updatedAt = System.currentTimeMillis())
        boxDao.update(updatedBox)
    }
    
    /**
     * 更新箱子基本信息
     */
    suspend fun updateBoxInfo(
        id: String,
        name: String,
        description: String? = null
    ) {
        val box = boxDao.getById(id) ?: return
        updateBox(box.copy(name = name, description = description))
    }
    
    /**
     * 更新箱子位置
     */
    suspend fun updateBoxLocation(boxId: String, locationId: String?) {
        boxDao.updateLocation(boxId, locationId, System.currentTimeMillis())
    }
    
    /**
     * 更新箱子照片
     */
    suspend fun updateBoxPhoto(boxId: String, photoPath: String?) {
        val box = boxDao.getById(boxId) ?: return
        updateBox(box.copy(photoPath = photoPath))
    }
    
    /**
     * 删除箱子
     * 注意：由于 ItemEntity 有外键约束 onDelete = CASCADE，删除箱子时会级联删除物品
     */
    suspend fun deleteBox(box: BoxEntity) {
        boxDao.delete(box)
    }
    
    /**
     * 根据ID删除箱子
     */
    suspend fun deleteBoxById(id: String) {
        boxDao.deleteById(id)
    }
}
