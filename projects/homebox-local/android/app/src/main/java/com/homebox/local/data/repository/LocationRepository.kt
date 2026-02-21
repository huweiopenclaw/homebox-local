package com.homebox.local.data.repository

import com.homebox.local.data.local.dao.LocationDao
import com.homebox.local.data.local.entity.LocationEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * 位置数据仓库
 * 负责位置相关的数据操作
 */
@Singleton
class LocationRepository @Inject constructor(
    private val locationDao: LocationDao
) {
    /**
     * 获取所有位置
     */
    fun getAllLocations(): Flow<List<LocationEntity>> = locationDao.getAll()
    
    /**
     * 根据ID获取位置
     */
    suspend fun getLocationById(id: String): LocationEntity? = locationDao.getById(id)
    
    /**
     * 根据房间获取位置
     */
    fun getLocationsByRoom(room: String): Flow<List<LocationEntity>> = 
        locationDao.getByRoom(room)
    
    /**
     * 获取所有房间
     */
    fun getAllRooms(): Flow<List<String>> = locationDao.getAllRooms()
    
    /**
     * 搜索位置
     */
    fun searchLocations(query: String): Flow<List<LocationEntity>> = locationDao.search(query)
    
    /**
     * 获取位置总数
     */
    fun getLocationCount(): Flow<Int> = locationDao.getCount()
    
    /**
     * 添加位置
     * @param room 房间名称
     * @param furniture 家具名称
     * @param position 位置描述
     * @param photoPath 照片路径
     * @param notes 备注
     * @return 创建的位置实体
     */
    suspend fun addLocation(
        room: String,
        furniture: String,
        position: String,
        photoPath: String? = null,
        notes: String? = null
    ): LocationEntity {
        val location = LocationEntity(
            id = UUID.randomUUID().toString(),
            room = room,
            furniture = furniture,
            position = position,
            photoPath = photoPath,
            notes = notes,
            createdAt = System.currentTimeMillis()
        )
        locationDao.insert(location)
        return location
    }
    
    /**
     * 更新位置
     */
    suspend fun updateLocation(location: LocationEntity) {
        locationDao.update(location)
    }
    
    /**
     * 更新位置信息
     */
    suspend fun updateLocationInfo(
        id: String,
        room: String,
        furniture: String,
        position: String,
        notes: String?
    ) {
        val location = locationDao.getById(id) ?: return
        locationDao.update(location.copy(
            room = room,
            furniture = furniture,
            position = position,
            notes = notes
        ))
    }
    
    /**
     * 更新位置照片
     */
    suspend fun updateLocationPhoto(locationId: String, photoPath: String?) {
        val location = locationDao.getById(locationId) ?: return
        locationDao.update(location.copy(photoPath = photoPath))
    }
    
    /**
     * 删除位置
     */
    suspend fun deleteLocation(location: LocationEntity) {
        locationDao.delete(location)
    }
    
    /**
     * 根据ID删除位置
     */
    suspend fun deleteLocationById(id: String) {
        locationDao.deleteById(id)
    }
}
