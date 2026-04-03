package com.homebox.local.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.homebox.local.data.local.dao.BoxDao
import com.homebox.local.data.local.dao.ItemDao
import com.homebox.local.data.local.dao.LocationDao
import com.homebox.local.data.local.dao.SearchHistoryDao
import com.homebox.local.data.local.entity.BoxEntity
import com.homebox.local.data.local.entity.ItemEntity
import com.homebox.local.data.local.entity.LocationEntity
import com.homebox.local.data.local.entity.SearchHistoryEntity

/**
 * Room 数据库
 */
@Database(
    entities = [
        BoxEntity::class,
        ItemEntity::class,
        LocationEntity::class,
        SearchHistoryEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun boxDao(): BoxDao
    abstract fun itemDao(): ItemDao
    abstract fun locationDao(): LocationDao
    abstract fun searchHistoryDao(): SearchHistoryDao
    
    companion object {
        const val DATABASE_NAME = "homebox_database"
    }
}
