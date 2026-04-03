// pages/ai-search/ai-search.js
const storage = require('../../utils/storage')
const aiChat = require('../../utils/ai-chat')
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    messages: [], // 对话记录
    inputText: '',
    loading: false,
    aiEnabled: false,
    suggestions: [
      '我有什么电子产品？',
      '客厅里有什么物品？',
      '最近添加了哪些东西？',
      '帮我找找外套在哪',
      '书房有多少本书？'
    ]
  },

  onLoad() {
    this.checkAI()
  },

  onShow() {
    this.checkAI()
  },

  checkAI() {
    const config = aiConfig.getConfig()
    this.setData({ aiEnabled: config.enabled })
    
    if (!config.enabled) {
      // 显示提示消息
      this.setData({
        messages: [{
          type: 'system',
          content: 'AI 对话搜索需要先配置 AI 服务。点击下方按钮去设置。',
          time: this.formatTime(new Date())
        }]
      })
    }
  },

  // 输入变化
  onInputChange(e) {
    this.setData({ inputText: e.detail.value })
  },

  // 点击建议
  onSuggestionTap(e) {
    const text = e.currentTarget.dataset.text
    this.setData({ inputText: text })
    this.sendQuery(text)
  },

  // 发送查询
  async sendQuery(query) {
    if (!query || !query.trim()) {
      wx.showToast({ title: '请输入问题', icon: 'none' })
      return
    }

    if (!this.data.aiEnabled) {
      wx.showModal({
        title: 'AI 未配置',
        content: '请先配置 AI 服务',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/ai-settings/ai-settings' })
          }
        }
      })
      return
    }

    // 添加用户消息
    const userMessage = {
      type: 'user',
      content: query,
      time: this.formatTime(new Date())
    }
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      loading: true
    })

    this.scrollToBottom()

    try {
      // 获取数据
      const items = storage.getAllItems()
      const locations = storage.getLocations()

      // AI 搜索
      const result = await aiChat.chatSearch(query, items, locations)

      // 构建回复消息
      const aiMessage = {
        type: 'ai',
        content: result,
        time: this.formatTime(new Date())
      }

      this.setData({
        messages: [...this.data.messages, aiMessage],
        loading: false
      })

      this.scrollToBottom()

    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: error.message,
        time: this.formatTime(new Date())
      }

      this.setData({
        messages: [...this.data.messages, errorMessage],
        loading: false
      })
    }
  },

  // 发送按钮
  onSend() {
    this.sendQuery(this.data.inputText)
  },

  // 点击物品
  onItemClick(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 清空对话
  onClearChat() {
    wx.showModal({
      title: '清空对话',
      content: '确定要清空所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ messages: [] })
          this.checkAI()
        }
      }
    })
  },

  // 去设置
  onGoSettings() {
    wx.navigateTo({ url: '/pages/ai-settings/ai-settings' })
  },

  // 滚动到底部
  scrollToBottom() {
    wx.pageScrollTo({
      selector: '.input-area',
      duration: 300
    })
  },

  // 格式化时间
  formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  }
})
