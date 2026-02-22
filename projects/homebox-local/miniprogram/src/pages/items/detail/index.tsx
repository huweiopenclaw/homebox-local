import { View, Text, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { itemService } from '../../../services/itemService'
import { useBoxStore } from '../../../stores/boxStore'
import { useLocationStore } from '../../../stores/locationStore'
import type { Item } from '../../../types'
import './index.scss'

interface ItemDetail extends Item {
  boxName?: string
  locationName?: string
}

export default function ItemDetailPage() {
  const router = useRouter()
  const { boxes, loadBoxes } = useBoxStore()
  const { locations, loadLocations } = useLocationStore()
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  
  useDidShow(() => {
    loadItemDetail()
  })
  
  const loadItemDetail = async () => {
    const itemId = router.params.id
    if (!itemId) {
      Taro.showToast({ title: '物品不存在', icon: 'none' })
      setTimeout(() => Taro.navigateBack(), 1500)
      return
    }
    
    setLoading(true)
    await Promise.all([
      loadBoxes(),
      loadLocations()
    ])
    
    const itemData = await itemService.getDetailById(itemId)
    
    if (!itemData) {
      Taro.showToast({ title: '物品不存在', icon: 'none' })
      setTimeout(() => Taro.navigateBack(), 1500)
      setLoading(false)
      return
    }
    
    const box = boxes.find(b => b.id === itemData.boxId)
    const location = box?.locationId ? locations.find(l => l.id === box.locationId) : null
    
    // 构建位置显示文本
    let locationName = '未设置位置'
    if (location) {
      const parts = [location.room]
      if (location.furniture) parts.push(location.furniture)
      if (location.position) parts.push(location.position)
      locationName = parts.join(' - ')
    }
    
    setItem({
      ...itemData,
      boxName: box?.name || '未知箱子',
      locationName
    })
    setLoading(false)
  }
  
  const handleQuantityChange = async (delta: number) => {
    if (!item) return
    
    try {
      const newQuantity = Math.max(0, item.quantity + delta)
      
      if (newQuantity === 0) {
        // 删除物品
        const res = await Taro.showModal({
          title: '确认删除',
          content: '数量将为0，是否删除该物品？'
        })
        
        if (res.confirm) {
          await itemService.delete(item.id)
          Taro.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        }
      } else {
        await itemService.updateQuantity(item.id, newQuantity)
        setItem({ ...item, quantity: newQuantity })
        Taro.showToast({ title: '已更新', icon: 'success' })
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }
  
  const handleEdit = () => {
    if (!item) return
    Taro.navigateTo({ url: `/pages/items/edit/index?id=${item.id}` })
  }
  
  const handleDelete = async () => {
    if (!item) return
    
    const res = await Taro.showModal({
      title: '确认删除',
      content: `确定要删除"${item.name}"吗？此操作不可恢复。`
    })
    
    if (res.confirm) {
      try {
        await itemService.delete(item.id)
        Taro.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 1500)
      } catch (error) {
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }
  
  const handleViewBox = () => {
    if (!item) return
    Taro.navigateTo({ url: `/pages/box/detail/index?id=${item.boxId}` })
  }
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  const getCategoryIcon = (category?: string): string => {
    const icons: Record<string, string> = {
      '日用品': '🪥',
      '电子产品': '📱',
      '证件': '🪪',
      '工具': '🔧',
      '重要物品': '⭐',
      '医疗用品': '💊',
      '服装': '👕',
      '办公用品': '📋',
      '食品': '🍱',
      '书籍': '📚',
      '玩具': '🎮',
      '运动器材': '⚽',
    }
    return icons[category || ''] || '📦'
  }
  
  const getCategoryColor = (category?: string): string => {
    const colors: Record<string, string> = {
      '日用品': '#4CAF50',
      '电子产品': '#2196F3',
      '证件': '#FF9800',
      '工具': '#795548',
      '重要物品': '#F44336',
      '医疗用品': '#E91E63',
      '服装': '#9C27B0',
      '办公用品': '#607D8B',
      '食品': '#8BC34A',
      '书籍': '#3F51B5',
      '玩具': '#FF5722',
      '运动器材': '#00BCD4',
    }
    return colors[category || ''] || '#78909C'
  }
  
  if (loading) {
    return (
      <View className="detail-page loading">
        <Text className="loading-text">加载中...</Text>
      </View>
    )
  }
  
  if (!item) {
    return (
      <View className="detail-page error">
        <Text className="error-text">物品不存在</Text>
      </View>
    )
  }
  
  return (
    <View className="detail-page">
      {/* 头部信息 */}
      <View className="item-header">
        <View 
          className="header-icon"
          style={{ backgroundColor: getCategoryColor(item.category) }}
        >
          <Text className="icon-text">{getCategoryIcon(item.category)}</Text>
        </View>
        <View className="header-info">
          <Text className="header-title">{item.name}</Text>
          {item.category && (
            <View className="header-category">
              <Text className="category-text">{item.category}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 数量控制 */}
      <View className="quantity-section">
        <View className="quantity-label">
          <Text className="label-text">数量</Text>
        </View>
        <View className="quantity-control">
          <View 
            className="control-btn minus"
            onClick={() => handleQuantityChange(-1)}
          >
            <Text className="btn-text">−</Text>
          </View>
          <View className="quantity-value">
            <Text className="value-text">{item.quantity}</Text>
          </View>
          <View 
            className="control-btn plus"
            onClick={() => handleQuantityChange(1)}
          >
            <Text className="btn-text">+</Text>
          </View>
        </View>
      </View>
      
      {/* 详细信息卡片 */}
      <View className="info-card">
        <View className="info-item" onClick={handleViewBox}>
          <View className="info-left">
            <Text className="info-icon">📦</Text>
            <Text className="info-label">所属箱子</Text>
          </View>
          <View className="info-right">
            <Text className="info-value">{item.boxName}</Text>
            <Text className="info-arrow">›</Text>
          </View>
        </View>
        
        <View className="info-divider"></View>
        
        <View className="info-item">
          <View className="info-left">
            <Text className="info-icon">📍</Text>
            <Text className="info-label">存放位置</Text>
          </View>
          <View className="info-right">
            <Text className="info-value">{item.locationName}</Text>
          </View>
        </View>
      </View>
      
      {/* 备注 */}
      {item.notes && (
        <View className="notes-card">
          <View className="notes-header">
            <Text className="notes-icon">📝</Text>
            <Text className="notes-title">备注</Text>
          </View>
          <View className="notes-content">
            <Text className="notes-text">{item.notes}</Text>
          </View>
        </View>
      )}
      
      {/* 标签 */}
      {item.tags && item.tags.length > 0 && (
        <View className="tags-card">
          <View className="tags-header">
            <Text className="tags-icon">🏷️</Text>
            <Text className="tags-title">标签</Text>
          </View>
          <View className="tags-list">
            {item.tags.map((tag, index) => (
              <View key={index} className="tag-item">
                <Text className="tag-text">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* 时间信息 */}
      <View className="time-card">
        <View className="time-item">
          <Text className="time-label">创建时间</Text>
          <Text className="time-value">{formatDate(item.createdAt)}</Text>
        </View>
        <View className="time-divider"></View>
        <View className="time-item">
          <Text className="time-label">更新时间</Text>
          <Text className="time-value">{formatDate(item.updatedAt)}</Text>
        </View>
      </View>
      
      {/* 操作按钮 */}
      <View className="action-buttons">
        <Button className="action-btn edit" onClick={handleEdit}>
          <Text className="btn-icon">✏️</Text>
          <Text className="btn-text">编辑</Text>
        </Button>
        <Button className="action-btn delete" onClick={handleDelete}>
          <Text className="btn-icon">🗑️</Text>
          <Text className="btn-text">删除</Text>
        </Button>
      </View>
    </View>
  )
}

export default definePageConfig({
  navigationBarTitleText: '物品详情'
})
