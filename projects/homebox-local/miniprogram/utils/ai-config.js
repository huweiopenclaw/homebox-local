// utils/ai-config.js
// AI 配置管理

const CONFIG_KEY = 'ai_config'

function getConfig() {
  try {
    const config = wx.getStorageSync(CONFIG_KEY)
    return config || {
      enabled: false,
      provider: 'openai', // openai, custom
      apiUrl: '',
      apiKey: '',
      model: 'gpt-4o'
    }
  } catch (e) {
    return {
      enabled: false,
      provider: 'openai',
      apiUrl: '',
      apiKey: '',
      model: 'gpt-4o'
    }
  }
}

function saveConfig(config) {
  try {
    wx.setStorageSync(CONFIG_KEY, config)
    return true
  } catch (e) {
    return false
  }
}

function isConfigured() {
  const config = getConfig()
  return config.enabled && config.apiUrl && config.apiKey
}

module.exports = {
  getConfig,
  saveConfig,
  isConfigured
}
