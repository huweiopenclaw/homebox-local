// pages/profile/profile.js
const storage = require('../../utils/storage')
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    itemCount: 0,
    locationCount: 0,
    categoryCount: 0,
    aiEnabled: false
  },

  onLoad() {
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  loadStats() {
    const items = storage.getAllItems()
    const locations = storage.getLocations()
    const categories = storage.getAllCategories()
    const config = aiConfig.getConfig()
    
    this.setData({
      itemCount: items.length,
      locationCount: locations.length,
      categoryCount: categories.length,
      aiEnabled: config.enabled
    })
  },

  onSettingsTap() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  onAISettingsTap() {
    wx.navigateTo({ url: '/pages/ai-settings/ai-settings' })
  },

  onBackupTap() {
    wx.navigateTo({ url: '/pages/backup/backup' })
  },

  onLocationTap() {
    wx.navigateTo({ url: '/pages/location/location' })
  },

  onCategoryTap() {
    wx.navigateTo({ url: '/pages/category/category' })
  },

  onBatchEditTap() {
    wx.navigateTo({ url: '/pages/batch-edit/batch-edit' })
  },

  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '这将清除临时缓存，不会删除物品数据',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              this.loadStats()
              wx.showToast({ title: '已清除', icon: 'success' })
            }
          })
        }
      }
    })
  },

  onAbout() {
    wx.showModal({
      title: '关于 HomeBox',
      content: 'HomeBox Local v1.0.0\n\n一款纯本地的家庭物品管理小程序\n\n功能：\n• 物品管理\n• 位置管理\n• AI 识别\n• AI 对话搜索\n• 数据备份',
      showCancel: false
    })
  }
})
