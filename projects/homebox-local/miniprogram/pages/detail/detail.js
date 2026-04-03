// pages/detail/detail.js
const storage = require('../../utils/storage')

Page({
  data: {
    mode: 'item', // item, list
    item: null,
    items: [],
    category: '',
    loading: true
  },

  onLoad(options) {
    const { id, category, mode } = options
    
    if (mode === 'all') {
      // 显示全部物品列表
      this.setData({ mode: 'list', category: '全部' })
      this.loadAllItems()
    } else if (category) {
      // 显示某分类下的物品列表
      this.setData({ mode: 'list', category })
      this.loadItemsByCategory(category)
    } else if (id) {
      // 显示单个物品详情
      this.setData({ mode: 'item' })
      this.loadItem(id)
    }
  },

  onShow() {
    if (this.data.mode === 'list') {
      if (this.data.category === '全部') {
        this.loadAllItems()
      } else {
        this.loadItemsByCategory(this.data.category)
      }
    }
  },

  loadItem(id) {
    const item = storage.getItem(id)
    if (item) {
      this.setData({ item, loading: false })
    } else {
      this.setData({ loading: false })
      wx.showToast({ title: '物品不存在', icon: 'none' })
    }
  },

  loadAllItems() {
    const items = storage.getAllItems()
    this.setData({ items, loading: false })
  },

  loadItemsByCategory(category) {
    const allItems = storage.getAllItems()
    const items = allItems.filter(item => item.category === category)
    this.setData({ items, loading: false })
  },

  // 点击物品（列表模式）
  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 编辑物品
  onEditTap() {
    wx.navigateTo({
      url: `/pages/edit-item/edit-item?id=${this.data.item.id}`
    })
  },

  // 删除物品
  onDeleteTap() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个物品吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteItem(this.data.item.id)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1500)
        }
      }
    })
  },

  // 预览照片
  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.item.photos || []
    if (photos.length > 0) {
      wx.previewImage({
        current: photos[index],
        urls: photos
      })
    }
  },

  // 分享
  onShareAppMessage() {
    const item = this.data.item
    if (item) {
      return {
        title: `我的物品：${item.name}`,
        path: `/pages/detail/detail?id=${item.id}`
      }
    }
    return {
      title: 'HomeBox - 家庭物品管理',
      path: '/pages/home/home'
    }
  }
})
