// pages/category/category.js
const storage = require('../../utils/storage')

Page({
  data: {
    categories: [],
    loading: true
  },

  onLoad() {
    this.loadCategories()
  },

  onShow() {
    this.loadCategories()
  },

  loadCategories() {
    const allCategories = storage.getAllCategories()
    const items = storage.getAllItems()
    
    // 计算每个分类的物品数量
    const categoriesWithCount = allCategories.map(cat => {
      const count = items.filter(item => item.category === cat.name).length
      return {
        ...cat,
        count
      }
    })
    
    // 添加"全部"分类
    const allCategory = {
      id: 'all',
      name: '全部',
      icon: '📦',
      count: items.length
    }
    
    this.setData({
      categories: [allCategory, ...categoriesWithCount],
      loading: false
    })
  },

  onCategoryTap(e) {
    const { name, id } = e.currentTarget.dataset
    
    if (id === 'all') {
      // 显示全部物品
      wx.navigateTo({
        url: `/pages/detail/detail?mode=all`
      })
    } else {
      // 显示该分类下的物品
      wx.navigateTo({
        url: `/pages/detail/detail?category=${name}`
      })
    }
  },

  onPullDownRefresh() {
    this.loadCategories()
    wx.stopPullDownRefresh()
  },

  // 添加自定义分类
  onAddCategory() {
    wx.showModal({
      title: '添加分类',
      editable: true,
      placeholderText: '请输入分类名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const name = res.content.trim()
          if (name) {
            storage.addCategory(name, '📦')
            this.loadCategories()
            wx.showToast({ title: '添加成功', icon: 'success' })
          }
        }
      }
    })
  }
})
