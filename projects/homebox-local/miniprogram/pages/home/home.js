// pages/home/home.js
const storage = require('../../utils/storage')
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    items: [],
    filteredItems: [],
    categories: [],
    currentCategory: '全部',
    
    // 位置筛选
    locations: [],
    rooms: [],
    currentRoom: '全部',
    showLocationFilter: false,
    
    // 排序
    sortOptions: [
      { value: 'time_desc', label: '最新添加' },
      { value: 'time_asc', label: '最早添加' },
      { value: 'name_asc', label: '名称 A-Z' },
      { value: 'name_desc', label: '名称 Z-A' },
      { value: 'quantity_desc', label: '数量最多' },
      { value: 'quantity_asc', label: '数量最少' }
    ],
    currentSort: 'time_desc',
    currentSortLabel: '最新添加', // 当前排序标签
    showSortPicker: false,
    
    loading: true,
    totalItems: 0,
    aiEnabled: false,
    
    // 视图模式
    viewMode: 'category',
    
    // 空状态
    isEmpty: true,
    showGuide: false
  },

  onLoad() {
    this.loadData()
    this.checkFirstUse()
  },

  onShow() {
    this.loadData()
    this.checkAI()
  },

  checkAI() {
    const config = aiConfig.getConfig()
    this.setData({ aiEnabled: config.enabled })
  },

  checkFirstUse() {
    const hasUsed = wx.getStorageSync('hasUsedApp')
    if (!hasUsed) {
      this.setData({ showGuide: true })
    }
  },

  closeGuide() {
    this.setData({ showGuide: false })
    wx.setStorageSync('hasUsedApp', true)
  },

  loadData() {
    const categories = storage.getDefaultCategories()
    const allItems = storage.getAllItems()
    const locations = storage.getLocations()
    
    const rooms = ['全部', ...locations.map(loc => loc.name)]
    
    const categoriesWithCount = categories.map(cat => {
      const count = cat.name === '全部' 
        ? allItems.length 
        : allItems.filter(item => item.category === cat.name).length
      return { ...cat, count }
    })

    const isEmpty = allItems.length === 0

    this.setData({ 
      categories: [{ id: 0, name: '全部', icon: '📋', count: allItems.length }, ...categoriesWithCount],
      totalItems: allItems.length,
      items: allItems,
      filteredItems: allItems,
      locations,
      rooms,
      isEmpty,
      loading: false
    })
    
    this.applyFilters()
  },

  // 切换视图模式
  onToggleView(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ viewMode: mode })
    this.applyFilters()
  },

  // 分类筛选
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ currentCategory: category, loading: true })
    this.applyFilters()
  },

  // 位置筛选
  onRoomTap(e) {
    const room = e.currentTarget.dataset.room
    this.setData({ currentRoom: room, loading: true })
    this.applyFilters()
  },

  // 显示排序选择器
  onShowSortPicker() {
    this.setData({ showSortPicker: true })
  },

  hideSortPicker() {
    this.setData({ showSortPicker: false })
  },

  onSortChange(e) {
    const index = parseInt(e.detail.value)
    const sort = this.data.sortOptions[index]
    this.setData({ 
      currentSort: sort.value, 
      currentSortLabel: sort.label,
      showSortPicker: false, 
      loading: true 
    })
    this.applyFilters()
  },

  // 应用筛选和排序
  applyFilters() {
    let items = [...this.data.items]
    
    // 分类筛选
    if (this.data.currentCategory !== '全部') {
      items = items.filter(item => item.category === this.data.currentCategory)
    }
    
    // 位置筛选
    if (this.data.currentRoom !== '全部') {
      items = items.filter(item => item.room === this.data.currentRoom)
    }
    
    // 排序
    items = this.sortItems(items, this.data.currentSort)

    this.setData({ filteredItems: items, loading: false })
  },

  // 排序逻辑
  sortItems(items, sortType) {
    const sorted = [...items]
    
    switch (sortType) {
      case 'time_desc':
        sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        break
      case 'time_asc':
        sorted.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        break
      case 'name_asc':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-CN'))
        break
      case 'name_desc':
        sorted.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'zh-CN'))
        break
      case 'quantity_desc':
        sorted.sort((a, b) => (b.quantity || 1) - (a.quantity || 1))
        break
      case 'quantity_asc':
        sorted.sort((a, b) => (a.quantity || 1) - (b.quantity || 1))
        break
    }
    
    return sorted
  },

  onToggleLocationFilter() {
    this.setData({ showLocationFilter: !this.data.showLocationFilter })
  },

  onItemTap(e) {
    const itemId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${itemId}`
    })
  },

  onAddTap() {
    wx.navigateTo({ url: '/pages/add-item/add-item' })
  },

  onSearchTap() {
    wx.switchTab({ url: '/pages/search/search' })
  },

  onLocationTap() {
    wx.navigateTo({ url: '/pages/location/location' })
  },

  onAIScanTap() {
    if (this.data.aiEnabled) {
      wx.navigateTo({ url: '/pages/ai-scan/ai-scan' })
    } else {
      wx.showModal({
        title: 'AI 识别',
        content: '请先配置 AI 识别服务',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/ai-settings/ai-settings' })
          }
        }
      })
    }
  },

  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  }
})
