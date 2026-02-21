import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { AIConfig } from '../api/aiApi'

interface SettingsState {
  aiConfig: AIConfig | null
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  hapticFeedback: boolean
  
  // Actions
  loadSettings: () => Promise<void>
  setAIConfig: (config: AIConfig) => Promise<void>
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (lang: 'zh-CN' | 'en-US') => void
  setHapticFeedback: (enabled: boolean) => void
  clearAllData: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  aiConfig: null,
  theme: 'system',
  language: 'zh-CN',
  hapticFeedback: true,
  
  loadSettings: async () => {
    try {
      const [aiConfigRes, themeRes, langRes, hapticRes] = await Promise.all([
        Taro.getStorage({ key: 'homebox_ai_config' }).catch(() => ({ data: null })),
        Taro.getStorage({ key: 'homebox_theme' }).catch(() => ({ data: 'system' })),
        Taro.getStorage({ key: 'homebox_language' }).catch(() => ({ data: 'zh-CN' })),
        Taro.getStorage({ key: 'homebox_haptic' }).catch(() => ({ data: true }))
      ])
      
      set({
        aiConfig: aiConfigRes.data ? JSON.parse(aiConfigRes.data) : null,
        theme: themeRes.data || 'system',
        language: langRes.data || 'zh-CN',
        hapticFeedback: hapticRes.data !== false
      })
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  },
  
  setAIConfig: async (config) => {
    await Taro.setStorage({
      key: 'homebox_ai_config',
      data: JSON.stringify(config)
    })
    set({ aiConfig: config })
  },
  
  setTheme: (theme) => {
    Taro.setStorage({ key: 'homebox_theme', data: theme })
    set({ theme })
  },
  
  setLanguage: (lang) => {
    Taro.setStorage({ key: 'homebox_language', data: lang })
    set({ language: lang })
  },
  
  setHapticFeedback: (enabled) => {
    Taro.setStorage({ key: 'homebox_haptic', data: enabled })
    set({ hapticFeedback: enabled })
  },
  
  clearAllData: async () => {
    const keys = [
      'homebox_boxes',
      'homebox_items', 
      'homebox_locations',
      'homebox_search_history',
      'homebox_ai_config'
    ]
    
    for (const key of keys) {
      try {
        await Taro.removeStorage({ key })
      } catch {}
    }
    
    set({ aiConfig: null })
    
    Taro.showToast({
      title: '数据已清除',
      icon: 'success'
    })
  }
}))
