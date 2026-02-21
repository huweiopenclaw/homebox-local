import { View, Text } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useBoxStore } from '../../stores/boxStore'
import './index.scss'

export default function HomePage() {
  const { boxes, loadBoxes } = useBoxStore()
  const [loading, setLoading] = useState(false)
  
  useDidShow(() => {
    loadBoxes()
  })
  
  const handleSearch = (query: string) => {
    Taro.navigateTo({ url: `/pages/search/index?q=${encodeURIComponent(query)}` })
  }
  
  const handleAddBox = () => {
    Taro.navigateTo({ url: '/pages/box/add/index' })
  }
  
  const handleChat = () => {
    Taro.navigateTo({ url: '/pages/chat/index' })
  }
  
  return (
    <View className="home-page">
      {/* 搜索栏 */}
      <View className="search-bar" onClick={() => Taro.navigateTo({ url: '/pages/search/index' })}>
        <Text className="search-icon">🔍</Text>
        <Text className="search-placeholder">搜索物品或箱子...</Text>
      </View>
      
      {/* 快捷操作 */}
      <View className="quick-actions">
        <View className="action-btn" onClick={handleAddBox}>
          <Text className="action-icon">📦</Text>
          <Text className="action-text">记录箱子</Text>
        </View>
        <View className="action-btn" onClick={handleChat}>
          <Text className="action-icon">💬</Text>
          <Text className="action-text">AI 查询</Text>
        </View>
      </View>
      
      {/* 统计卡片 */}
      <View className="stats-card">
        <View className="stat-item">
          <Text className="stat-value">{boxes.length}</Text>
          <Text className="stat-label">箱子</Text>
        </View>
        <View className="stat-divider"></View>
        <View className="stat-item">
          <Text className="stat-value">{boxes.reduce((sum, b) => sum + (b.itemCount || 0), 0)}</Text>
          <Text className="stat-label">物品</Text>
        </View>
        <View className="stat-divider"></View>
        <View className="stat-item">
          <Text className="stat-value">0</Text>
          <Text className="stat-label">位置</Text>
        </View>
      </View>
      
      {/* 最近记录 */}
      <View className="section">
        <View className="section-header">
          <Text className="section-title">最近记录</Text>
          <Text className="section-more" onClick={() => Taro.navigateTo({ url: '/pages/box/list/index' })}>
            查看全部 →
          </Text>
        </View>
        
        {boxes.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-icon">📦</Text>
            <Text className="empty-text">还没有记录任何箱子</Text>
            <View className="empty-btn" onClick={handleAddBox}>
              <Text>添加第一个箱子</Text>
            </View>
          </View>
        ) : (
          <View className="box-list">
            {boxes.slice(0, 5).map(box => (
              <View 
                key={box.id} 
                className="box-card"
                onClick={() => Taro.navigateTo({ url: `/pages/box/detail/index?id=${box.id}` })}
              >
                <View className="box-photo">
                  {box.photoPath ? (
                    <Text>📷</Text>
                  ) : (
                    <Text>📦</Text>
                  )}
                </View>
                <View className="box-info">
                  <Text className="box-name">{box.name}</Text>
                  <Text className="box-location">{box.location || '未设置位置'}</Text>
                </View>
                <Text className="box-arrow">›</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* 添加按钮 */}
      <View className="fab" onClick={handleAddBox}>
        <Text className="fab-icon">+</Text>
      </View>
    </View>
  )
}
