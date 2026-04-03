// pages/ai-settings/ai-settings.js
const aiConfig = require('../../utils/ai-config')

Page({
  data: {
    config: {
      enabled: false,
      provider: 'custom',
      apiUrl: '',
      apiKey: '',
      model: ''
    },
    // 预设模板（仅供参考，不锁定）
    presets: [
      { 
        name: 'OpenAI GPT-4o', 
        provider: 'openai',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o'
      },
      { 
        name: '智谱 GLM-4V', 
        provider: 'zhipu',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4v'
      },
      { 
        name: '阿里云千问 VL', 
        provider: 'qwen',
        apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-vl-max'
      },
      { 
        name: 'DeepSeek Vision', 
        provider: 'deepseek',
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-vision'
      },
      {
        name: 'Moonshot Kimi Vision',
        provider: 'moonshot',
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        model: 'moonshot-v1-8k-vision'
      },
      {
        name: '自定义',
        provider: 'custom',
        apiUrl: '',
        model: ''
      }
    ],
    presetIndex: 0,
    testing: false,
    testResult: '',
    showApiKey: false
  },

  onLoad() {
    this.loadConfig()
  },

  loadConfig() {
    const config = aiConfig.getConfig()
    // 找到匹配的预设
    let presetIndex = this.data.presets.findIndex(p => 
      p.provider === config.provider && p.apiUrl === config.apiUrl
    )
    if (presetIndex < 0) presetIndex = this.data.presets.length - 1 // 默认自定义
    
    this.setData({
      config,
      presetIndex
    })
  },

  // 开关 AI 功能
  onEnableChange(e) {
    this.setData({
      'config.enabled': e.detail.value
    })
    this.saveConfig()
  },

  // 选择预设模板
  onPresetChange(e) {
    const index = parseInt(e.detail.value)
    const preset = this.data.presets[index]
    
    // 应用预设值（用户仍可修改）
    this.setData({
      presetIndex: index,
      'config.provider': preset.provider,
      'config.apiUrl': preset.apiUrl,
      'config.model': preset.model
    })
    this.saveConfig()
  },

  // API URL 输入 - 可自由编辑
  onApiUrlInput(e) {
    this.setData({
      'config.apiUrl': e.detail.value
    })
  },

  onApiUrlBlur() {
    this.saveConfig()
  },

  // API Key 输入
  onApiKeyInput(e) {
    this.setData({
      'config.apiKey': e.detail.value
    })
  },

  onApiKeyBlur() {
    this.saveConfig()
  },

  // 切换显示 API Key
  toggleShowApiKey() {
    this.setData({
      showApiKey: !this.data.showApiKey
    })
  },

  // 模型名称输入 - 可自由编辑
  onModelInput(e) {
    this.setData({
      'config.model': e.detail.value
    })
  },

  onModelBlur() {
    this.saveConfig()
  },

  // 保存配置
  saveConfig() {
    aiConfig.saveConfig(this.data.config)
  },

  // 测试连接
  async onTestConnection() {
    const { apiUrl, apiKey, model } = this.data.config
    
    if (!apiUrl) {
      wx.showToast({ title: '请输入 API URL', icon: 'none' })
      return
    }
    
    if (!apiKey) {
      wx.showToast({ title: '请输入 API Key', icon: 'none' })
      return
    }

    this.setData({ testing: true, testResult: '' })

    try {
      // 构建 OpenAI 兼容格式的请求
      const requestBody = {
        model: model || 'gpt-4o',
        messages: [
          { 
            role: 'user', 
            content: 'Hello, please respond with "OK" to confirm the connection.' 
          }
        ],
        max_tokens: 50
      }

      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: apiUrl,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          data: requestBody,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              // 尝试解析错误信息
              let errMsg = `HTTP ${res.statusCode}`
              if (res.data?.error?.message) {
                errMsg = res.data.error.message
              }
              reject(new Error(errMsg))
            }
          },
          fail: (err) => {
            reject(new Error(err.errMsg || '网络请求失败'))
          },
          timeout: 30000
        })
      })

      this.setData({ testResult: '✅ 连接成功！API 配置正确。' })
      wx.showToast({ title: '连接成功', icon: 'success' })
      
    } catch (error) {
      const errorMsg = error.message || '连接失败'
      this.setData({ testResult: `❌ ${errorMsg}` })
      wx.showToast({ title: errorMsg.substring(0, 10), icon: 'none' })
    } finally {
      this.setData({ testing: false })
    }
  },

  // 保存并返回
  onSave() {
    const { apiUrl, apiKey, model } = this.data.config
    
    if (this.data.config.enabled) {
      if (!apiUrl || !apiKey) {
        wx.showToast({ title: '请完成必填配置', icon: 'none' })
        return
      }
    }
    
    this.saveConfig()
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  // 查看帮助
  onHelp() {
    wx.showModal({
      title: 'VLM API 配置说明',
      content: `本应用支持任何 OpenAI 兼容格式的视觉语言模型 API。

配置步骤：
1. 选择预设或选择"自定义"
2. 输入 API URL（接口地址）
3. 输入 API Key（密钥）
4. 输入模型名称
5. 点击"测试连接"验证

常见服务商：
• OpenAI: platform.openai.com
• 智谱 AI: open.bigmodel.cn
• 阿里云: dashscope.aliyuncs.com
• DeepSeek: api.deepseek.com
• 自建服务: 输入您的服务地址

API 格式要求：
需支持 OpenAI Chat Completions 格式的 /chat/completions 接口。`,
      showCancel: false
    })
  },

  // 复制预设 URL
  onCopyUrl(e) {
    const url = e.currentTarget.dataset.url
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  }
})
