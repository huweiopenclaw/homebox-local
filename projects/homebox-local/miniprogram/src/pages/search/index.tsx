import { View, Text, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useBoxStore } from '../../stores/boxStore'
import './index.scss'

export default function SearchPage() {
  const { boxes } = useBoxStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof boxes>([])
  const [searchMode, setSearchMode] = useState<'keyword' | 'ai'>('keyword')
  
  useEffect(() => {
    // 从 URL 参数获取搜索词
    const params = Taro.getCurrentInstance().router?.params
    if (params?.q) {
      setQuery(decodeURIComponent(params.q))
      performSearch(decodeURIComponent(params.q))
    }
  }, [])
  
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    
    // 关键词搜索
    const filtered = boxes.filter(box => {
      const searchText = searchQuery.toLowerCase()
      return box.name.toLowerCase().includes(searchText) ||
             (box.description?.toLowerCase().includes(searchText))
    })
    
    setResults(filtered)
  }
  
  const handleInputChange = (e: any) => {
    const value = e.detail.value
    setQuery(value)
    if (searchMode === 'keyword') {
      performSearch(value)
    }
  }
  
  const handleAISearch = async () => {
    if (!query.trim()) return
    
    Taro.showLoading({ title: 'AI 搜索中...' })
    
    // TODO: 调用 AI 搜索
    setTimeout(() => {
      Taro.hideLoading()
      // 模拟 AI 搜索结果
      setResults(boxes.slice(0, 3))
    }, 1500)
  }
  
  const handleBoxClick = (boxId: string) => {
    Taro.navigateTo({ url: `/pages/box/detail/index?id=${boxId}` })
  }
  
  return (
    <View className="search-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrapper">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索物品或箱子..."
            value={query}
            onInput={handleInputChange}
            confirmType="search"
            onConfirm={() => searchMode === 'ai' ? handleAISearch() : performSearch(query)}
          />
          {query && (
            <Text className="clear-icon" onClick={() => { setQuery(''); setResults([]) }}>✕</Text>
          )}
        </View>
      </View>
      
      {/* 搜索模式切换 */}
      <View className="search-modes">
        <View 
          className={`mode-btn ${searchMode === 'keyword' ? 'active' : ''}`}
          onClick={() => setSearchMode('keyword')}
        >
          <Text className="mode-icon">🔤</Text>
          <Text className="mode-text">关键词</Text>
        </View>
        <View 
          className={`mode-btn ${searchMode === 'ai' ? 'active' : ''}`}
          onClick={() => setSearchMode('ai')}
        >
          <Text className="mode-icon">🤖</Text>
          <Text className="mode-text">AI 搜索</Text>
        </View>
      </View>
      
      {/* AI 搜索提示 */}
      {searchMode === 'ai' && query && (
        <View className="ai-search-tip" onClick={handleAISearch}>
          <Text className="tip-text">点击搜索，AI 将理解您的自然语言查询</Text>
          <Text className="tip-example">例如："我的充电器在哪里？"</Text>
        </View>
      )}
      
      {/* 搜索结果 */}
      <View className="results-section">
        {query && results.length === 0 ? (
          <View className="empty-result">
            <Text className="empty-icon">🔍</Text>
            <Text className="empty-text">没有找到相关结果</Text>
          </View>
        ) : (
          <View className="result-list">
            {results.map(box => (
              <View 
                key={box.id} 
                className="result-card"
                onClick={() => handleBoxClick(box.id)}
              >
                <View className="card-icon">
                  <Text>{box.photoPath ? '📷' : '📦'}</Text>
                </View>
                <View className="card-content">
                  <Text className="card-title">{box.name}</Text>
                  <Text className="card-subtitle">{box.location || '未设置位置'}</Text>
                </View>
                <Text className="card-arrow">›</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* 快捷标签 */}
      {!query && (
        <View className="quick-tags">
          <Text className="tags-title">常用搜索</Text>
          <View className="tags-list">
            {['充电器', '证件', '冬季衣物', '工具'].map(tag => (
              <View 
                key={tag} 
                className="tag"
                onClick={() => { setQuery(tag); performSearch(tag) }}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

export default definePageConfig({
  navigationBarTitleText: '搜索'
})
