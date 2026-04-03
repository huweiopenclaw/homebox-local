// pages/search/search.js
const storage = require('../../utils/storage')
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    keyword: '',
    categories: [],
    selectedCategory: '',
    items: [],
    loading: false,
    aiEnabled: false,
    searchHistory: []
  },

  onLoad() {
    const categories = storage.getDefaultCategories()
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ 
      categories,
      searchHistory: history.slice(0, 10)
    })
    this.checkAI()
  },

  onShow() {
    this.checkAI()
  },

  checkAI() {
    const config = aiConfig.getConfig()
    this.setData({ aiEnabled: config.enabled })
  },

  onInputChange(e) {
    const keyword = e.detail.value
    this.setData({ keyword })
    
    // 实时搜索
    if (keyword.length >= 1) {
      this.doSearch(keyword)
    } else {
      this.setData({ items: [] })
    }
  },

  onClearInput() {
    this.setData({ keyword: '', items: [] })
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category
    const selectedCategory = this.data.selectedCategory === category ? '' : category
    this.setData({ selectedCategory })
    this.doSearch(this.data.keyword)
  },

  doSearch(keyword) {
    const { selectedCategory } = this.data
    
    if (!keyword && !selectedCategory) {
      this.setData({ items: [] })
      return
    }

    this.setData({ loading: true })

    let items = storage.getAllItems()

    // 关键词搜索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(lowerKeyword) ||
        (item.description && item.description.toLowerCase().includes(lowerKeyword)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))) ||
        (item.location && item.location.toLowerCase().includes(lowerKeyword))
      )
    }

    // 分类筛选
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory)
    }

    this.setData({ items, loading: false })
    
    // 保存搜索历史
    if (keyword && keyword.length >= 2) {
      this.saveHistory(keyword)
    }
  },

  saveHistory(keyword) {
    let history = this.data.searchHistory.filter(h => h !== keyword)
    history.unshift(keyword)
    history = history.slice(0, 10)
    this.setData({ searchHistory: history })
    wx.setStorageSync('searchHistory', history)
  },

  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  onClearHistory() {
    wx.showModal({
      title: '清空历史',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 跳转 AI 对话搜索
  onAISearchTap() {
    wx.navigateTo({
      url: '/pages/ai-search/ai-search'
    })
  },

  onPullDownRefresh() {
    this.doSearch(this.data.keyword)
    wx.stopPullDownRefresh()
  }
})
