import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { useItemStore } from '../../stores/itemStore'
import { useBoxStore } from '../../stores/boxStore'
import { useLocationStore } from '../../stores/locationStore'
import { itemService } from '../../services/itemService'
import type { Item } from '../../types'
import './index.scss'

interface ItemWithLocation extends Item {
  locationName?: string
  boxName?: string
}

export default function ItemsListPage() {
  const { items, loadItems } = useItemStore()
  const { boxes, loadBoxes } = useBoxStore()
  const { locations, loadLocations } = useLocationStore()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>(['全部分类'])
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [filteredItems, setFilteredItems] = useState<ItemWithLocation[]>([])
  const [keyword, setKeyword] = useState('')
  
  useDidShow(() => {
    loadData()
  })
  
  const loadData = async () => {
    setLoading(true)
    await Promise.all([
      loadItems(),
      loadBoxes(),
      loadLocations()
    ])
    await loadCategories()
    setLoading(false)
  }
  
  const loadCategories = async () => {
    const cats = await itemService.getCategories()
    setCategories(['全部分类', ...cats])
  }
  
  useEffect(() => {
    filterItems()
  }, [items, selectedCategory, keyword, boxes, locations])
  
  const filterItems = () => {
    let result = items.map(item => {
      const box = boxes.find(b => b.id === item.boxId)
      const location = box?.locationId ? locations.find(l => l.id === box.locationId) : null
      
      // 构建位置显示文本
      let locationName = '未设置位置'
      if (location) {
        const parts = [location.room]
        if (location.furniture) parts.push(location.furniture)
        if (location.position) parts.push(location.position)
        locationName = parts.join(' - ')
      }
      
      return {
        ...item,
        locationName,
        boxName: box?.name || '未知箱子'
      }
    })
    
    // 按分类筛选
    if (selectedCategory > 0) {
      const category = categories[selectedCategory]
      result = result.filter(item => item.category === category)
    }
    
    // 按关键词搜索
    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      result = result.filter(item => 
        item.name.toLowerCase().includes(kw) ||
        item.locationName?.toLowerCase().includes(kw) ||
        item.notes?.toLowerCase().includes(kw) ||
        item.tags?.some(tag => tag.toLowerCase().includes(kw))
      )
    }
    
    setFilteredItems(result)
  }
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(parseInt(e.detail.value))
  }
  
  const handleSearchInput = (e) => {
    setKeyword(e.detail.value)
  }
  
  const handleClearSearch = () => {
    setKeyword('')
  }
  
  const handleItemClick = (itemId: string) => {
    Taro.navigateTo({ url: `/pages/items/detail/index?id=${itemId}` })
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
  
  return (
    <View className="items-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrapper">
          <Text className="search-icon">🔍</Text>
          <input
            className="search-input"
            placeholder="搜索物品名称、位置、备注..."
            value={keyword}
            onInput={handleSearchInput}
            confirm-type="search"
          />
          {keyword && (
            <Text className="clear-icon" onClick={handleClearSearch}>✕</Text>
          )}
        </View>
      </View>
      
      {/* 分类筛选 */}
      <View className="category-filter">
        <View className="filter-label">分类：</View>
        <Picker 
          mode="selector" 
          range={categories} 
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <View className="picker-value">
            <Text>{categories[selectedCategory]}</Text>
            <Text className="picker-arrow">▼</Text>
          </View>
        </Picker>
      </View>
      
      {/* 物品列表 */}
      {loading ? (
        <View className="loading-state">
          <Text className="loading-text">加载中...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-icon">📦</Text>
          <Text className="empty-text">
            {keyword || selectedCategory > 0 ? '没有找到符合条件的物品' : '暂无物品记录'}
          </Text>
        </View>
      ) : (
        <ScrollView 
          className="items-list"
          scrollY
          scrollWithAnimation
        >
          <View className="list-info">
            <Text className="info-text">共 {filteredItems.length} 件物品</Text>
          </View>
          
          {filteredItems.map(item => (
            <View 
              key={item.id}
              className="item-card"
              onClick={() => handleItemClick(item.id)}
            >
              {/* 左侧图标 */}
              <View 
                className="item-icon"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              >
                <Text className="icon-text">{getCategoryIcon(item.category)}</Text>
              </View>
              
              {/* 中间信息 */}
              <View className="item-content">
                <View className="item-header">
                  <Text className="item-name">{item.name}</Text>
                  {item.category && (
                    <View className="category-tag">
                      <Text className="tag-text">{item.category}</Text>
                    </View>
                  )}
                </View>
                
                <View className="item-meta">
                  <View className="meta-row">
                    <Text className="meta-icon">📍</Text>
                    <Text className="meta-text">{item.locationName}</Text>
                  </View>
                </View>
                
                {item.notes && (
                  <View className="item-notes">
                    <Text className="notes-text" numberOfLines={1}>{item.notes}</Text>
                  </View>
                )}
              </View>
              
              {/* 右侧数量和箭头 */}
              <View className="item-right">
                {item.quantity > 1 && (
                  <View className="quantity-badge">
                    <Text className="quantity-text">×{item.quantity}</Text>
                  </View>
                )}
                <Text className="arrow-icon">›</Text>
              </View>
            </View>
          ))}
          
          {/* 底部留白 */}
          <View className="list-bottom"></View>
        </ScrollView>
      )}
    </View>
  )
}

export default definePageConfig({
  navigationBarTitleText: '物品列表'
})
