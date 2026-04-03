// pages/settings/settings.js
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    settings: {
      notifications: true,
      darkMode: false,
      language: 'zh-CN'
    },
    aiConfig: null
  },

  onShow() {
    this.loadAIConfig()
  },

  loadAIConfig() {
    const config = aiConfig.getConfig()
    this.setData({ aiConfig: config })
  },

  onNotificationChange(e) {
    this.setData({
      'settings.notifications': e.detail.value
    })
    wx.showToast({ title: '设置已保存', icon: 'success' })
  },

  onDarkModeChange(e) {
    this.setData({
      'settings.darkMode': e.detail.value
    })
    wx.showToast({ title: '深色模式开发中', icon: 'none' })
  },

  onAISettingsTap() {
    wx.navigateTo({
      url: '/pages/ai-settings/ai-settings'
    })
  },

  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          wx.showToast({ title: '缓存已清除', icon: 'success' })
          this.onShow()
        }
      }
    })
  }
})
