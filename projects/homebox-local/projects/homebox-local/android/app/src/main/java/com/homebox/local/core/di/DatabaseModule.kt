package com.homebox.local.core.di

import android.content.Context
import androidx.room.Room
import com.homebox.local.data.local.AppDatabase
import com.homebox.local.data.local.dao.BoxDao
import com.homebox.local.data.local.dao.ItemDao
import com.homebox.local.data.local.dao.LocationDao
import com.homebox.local.data.local.dao.SearchHistoryDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * 数据库依赖注入模块
 */
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    /**
     * 提供 Room 数据库实例
     */
    @Provides
    @Singleton
    fun provideDatabase(
        @ApplicationContext context: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            AppDatabase.DATABASE_NAME
        ).build()
    }
    
    /**
     * 提供箱子 DAO
     */
    @Provides
    fun provideBoxDao(database: AppDatabase): BoxDao {
        return database.boxDao()
    }
    
    /**
     * 提供物品 DAO
     */
    @Provides
    fun provideItemDao(database: AppDatabase): ItemDao {
        return database.itemDao()
    }
    
    /**
     * 提供位置 DAO
     */
    @Provides
    fun provideLocationDao(database: AppDatabase): LocationDao {
        return database.locationDao()
    }
    
    /**
     * 提供搜索历史 DAO
     */
    @Provides
    fun provideSearchHistoryDao(database: AppDatabase): SearchHistoryDao {
        return database.searchHistoryDao()
    }
}
