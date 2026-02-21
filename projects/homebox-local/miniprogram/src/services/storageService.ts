/**
 * 存储服务 - 封装 Taro 存储API
 * 提供统一的本地存储接口
 */

import Taro from '@tarojs/taro'
import type { Box, Item, Location, AIConfig } from '../types'

// 存储键名常量
const STORAGE_KEYS = {
  BOXES: 'homebox_boxes',
  ITEMS: 'homebox_items',
  LOCATIONS: 'homebox_locations',
  AI_CONFIG: 'homebox_ai_config',
  SEARCH_HISTORY: 'homebox_search_history',
  SETTINGS: 'homebox_settings',
} as const

// 容量限制
const MAX_STORAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_PHOTO_SIZE = 200 * 1024 // 单张最大 200KB
const PHOTO_QUALITY = 70 // 压缩质量

/**
 * 存储服务类
 */
class StorageService {
  /**
   * 获取当前存储使用情况
   */
  async getStorageInfo(): Promise<Taro.getStorageInfo.SuccessCallbackOption> {
    return await Taro.getStorageInfo()
  }

  /**
   * 检查存储空间是否充足
   */
  async checkStorageAvailable(requiredSize: number = 0): Promise<boolean> {
    const info = await this.getStorageInfo()
    const availableSize = info.limit - info.currentSize
    return availableSize > requiredSize
  }

  /**
   * 通用存储方法
   */
  async set<T>(key: string, data: T): Promise<void> {
    try {
      await Taro.setStorage({ key, data })
    } catch (error) {
      console.error(`存储失败 [${key}]:`, error)
      throw new Error('存储失败，请检查存储空间')
    }
  }

  /**
   * 通用读取方法
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const res = await Taro.getStorage<{ data: T }>({ key })
      return res.data as T
    } catch (error) {
      // key 不存在返回 null
      return null
    }
  }

  /**
   * 通用同步存储方法
   */
  setSync<T>(key: string, data: T): void {
    try {
      Taro.setStorageSync(key, data)
    } catch (error) {
      console.error(`同步存储失败 [${key}]:`, error)
      throw new Error('存储失败')
    }
  }

  /**
   * 通用同步读取方法
   */
  getSync<T>(key: string): T | null {
    try {
      return Taro.getStorageSync(key) as T
    } catch {
      return null
    }
  }

  /**
   * 删除指定 key
   */
  async remove(key: string): Promise<void> {
    try {
      await Taro.removeStorage({ key })
    } catch (error) {
      console.error(`删除失败 [${key}]:`, error)
    }
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    try {
      await Taro.clearStorage()
    } catch (error) {
      console.error('清空存储失败:', error)
    }
  }

  // ============== 箱子相关 ==============

  /**
   * 获取所有箱子
   */
  async getBoxes(): Promise<Box[]> {
    return (await this.get<Box[]>(STORAGE_KEYS.BOXES)) || []
  }

  /**
   * 保存所有箱子
   */
  async saveBoxes(boxes: Box[]): Promise<void> {
    await this.set(STORAGE_KEYS.BOXES, boxes)
  }

  /**
   * 添加箱子
   */
  async addBox(box: Box): Promise<void> {
    const boxes = await this.getBoxes()
    boxes.push(box)
    await this.saveBoxes(boxes)
  }

  /**
   * 更新箱子
   */
  async updateBox(box: Box): Promise<void> {
    const boxes = await this.getBoxes()
    const index = boxes.findIndex(b => b.id === box.id)
    if (index !== -1) {
      boxes[index] = { ...box, updatedAt: Date.now() }
      await this.saveBoxes(boxes)
    }
  }

  /**
   * 删除箱子
   */
  async deleteBox(id: string): Promise<void> {
    const boxes = await this.getBoxes()
    const filtered = boxes.filter(b => b.id !== id)
    await this.saveBoxes(filtered)
    // 同时删除箱子内的物品
    await this.deleteItemsByBoxId(id)
  }

  /**
   * 根据 ID 获取箱子
   */
  async getBoxById(id: string): Promise<Box | null> {
    const boxes = await this.getBoxes()
    return boxes.find(b => b.id === id) || null
  }

  // ============== 物品相关 ==============

  /**
   * 获取所有物品
   */
  async getItems(): Promise<Item[]> {
    return (await this.get<Item[]>(STORAGE_KEYS.ITEMS)) || []
  }

  /**
   * 保存所有物品
   */
  async saveItems(items: Item[]): Promise<void> {
    await this.set(STORAGE_KEYS.ITEMS, items)
  }

  /**
   * 添加物品
   */
  async addItem(item: Item): Promise<void> {
    const items = await this.getItems()
    items.push(item)
    await this.saveItems(items)
  }

  /**
   * 批量添加物品
   */
  async addItems(newItems: Item[]): Promise<void> {
    const items = await this.getItems()
    items.push(...newItems)
    await this.saveItems(items)
  }

  /**
   * 更新物品
   */
  async updateItem(item: Item): Promise<void> {
    const items = await this.getItems()
    const index = items.findIndex(i => i.id === item.id)
    if (index !== -1) {
      items[index] = { ...item, updatedAt: Date.now() }
      await this.saveItems(items)
    }
  }

  /**
   * 删除物品
   */
  async deleteItem(id: string): Promise<void> {
    const items = await this.getItems()
    const filtered = items.filter(i => i.id !== id)
    await this.saveItems(filtered)
  }

  /**
   * 删除指定箱子的所有物品
   */
  async deleteItemsByBoxId(boxId: string): Promise<void> {
    const items = await this.getItems()
    const filtered = items.filter(i => i.boxId !== boxId)
    await this.saveItems(filtered)
  }

  /**
   * 根据 ID 获取物品
   */
  async getItemById(id: string): Promise<Item | null> {
    const items = await this.getItems()
    return items.find(i => i.id === id) || null
  }

  /**
   * 根据箱子 ID 获取物品列表
   */
  async getItemsByBoxId(boxId: string): Promise<Item[]> {
    const items = await this.getItems()
    return items.filter(i => i.boxId === boxId)
  }

  /**
   * 搜索物品
   */
  async searchItems(keyword: string): Promise<Item[]> {
    const items = await this.getItems()
    const lowerKeyword = keyword.toLowerCase()
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.category?.toLowerCase().includes(lowerKeyword) ||
      item.notes?.toLowerCase().includes(lowerKeyword) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  // ============== 位置相关 ==============

  /**
   * 获取所有位置
   */
  async getLocations(): Promise<Location[]> {
    return (await this.get<Location[]>(STORAGE_KEYS.LOCATIONS)) || []
  }

  /**
   * 保存所有位置
   */
  async saveLocations(locations: Location[]): Promise<void> {
    await this.set(STORAGE_KEYS.LOCATIONS, locations)
  }

  /**
   * 添加位置
   */
  async addLocation(location: Location): Promise<void> {
    const locations = await this.getLocations()
    locations.push(location)
    await this.saveLocations(locations)
  }

  /**
   * 更新位置
   */
  async updateLocation(location: Location): Promise<void> {
    const locations = await this.getLocations()
    const index = locations.findIndex(l => l.id === location.id)
    if (index !== -1) {
      locations[index] = location
      await this.saveLocations(locations)
    }
  }

  /**
   * 删除位置
   */
  async deleteLocation(id: string): Promise<void> {
    const locations = await this.getLocations()
    const filtered = locations.filter(l => l.id !== id)
    await this.saveLocations(filtered)
    // 同时解除箱子与该位置的关联
    const boxes = await this.getBoxes()
    const updated = boxes.map(b => 
      b.locationId === id ? { ...b, locationId: undefined } : b
    )
    await this.saveBoxes(updated)
  }

  /**
   * 根据 ID 获取位置
   */
  async getLocationById(id: string): Promise<Location | null> {
    const locations = await this.getLocations()
    return locations.find(l => l.id === id) || null
  }

  // ============== AI 配置相关 ==============

  /**
   * 获取 AI 配置
   */
  async getAIConfig(): Promise<AIConfig | null> {
    return await this.get<AIConfig>(STORAGE_KEYS.AI_CONFIG)
  }

  /**
   * 保存 AI 配置
   */
  async saveAIConfig(config: AIConfig): Promise<void> {
    await this.set(STORAGE_KEYS.AI_CONFIG, config)
  }

  /**
   * 检查 AI 是否已配置
   */
  async isAIConfigured(): Promise<boolean> {
    const config = await this.getAIConfig()
    return !!(config?.apiKey)
  }

  // ============== 设置相关 ==============

  /**
   * 获取应用设置
   */
  async getSettings<K = Record<string, unknown>>(): Promise<K | null> {
    return await this.get<K>(STORAGE_KEYS.SETTINGS)
  }

  /**
   * 保存应用设置
   */
  async saveSettings<K = Record<string, unknown>>(settings: K): Promise<void> {
    await this.set(STORAGE_KEYS.SETTINGS, settings)
  }

  // ============== 搜索历史相关 ==============

  /**
   * 获取搜索历史
   */
  async getSearchHistory(): Promise<string[]> {
    return (await this.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY)) || []
  }

  /**
   * 添加搜索历史
   */
  async addSearchHistory(keyword: string): Promise<void> {
    const history = await this.getSearchHistory()
    // 去重并添加到最前面
    const filtered = history.filter(h => h !== keyword)
    filtered.unshift(keyword)
    // 最多保留 20 条
    const trimmed = filtered.slice(0, 20)
    await this.set(STORAGE_KEYS.SEARCH_HISTORY, trimmed)
  }

  /**
   * 清空搜索历史
   */
  async clearSearchHistory(): Promise<void> {
    await this.remove(STORAGE_KEYS.SEARCH_HISTORY)
  }

  // ============== 图片处理相关 ==============

  /**
   * 选择并压缩图片
   */
  async chooseAndCompressImage(
    sourceType: ('album' | 'camera')[] = ['album', 'camera']
  ): Promise<string | null> {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType,
      })

      if (res.tempFiles.length === 0) return null

      const tempFilePath = res.tempFiles[0].tempFilePath
      
      // 压缩图片
      const compressedPath = await this.compressImage(tempFilePath)
      
      // 保存为持久化文件
      const savedPath = await Taro.saveFile({
        tempFilePath: compressedPath,
      })

      return savedPath.savedFilePath
    } catch (error) {
      console.error('选择图片失败:', error)
      return null
    }
  }

  /**
   * 压缩图片
   */
  async compressImage(filePath: string): Promise<string> {
    try {
      const info = await Taro.getImageInfo({ src: filePath })
      
      // 如果图片太大，需要压缩
      if (info.width > 1080 || info.height > 1080) {
        const res = await Taro.compressImage({
          src: filePath,
          quality: PHOTO_QUALITY,
        })
        return res.tempFilePath
      }
      
      // 小图直接返回
      return filePath
    } catch (error) {
      console.error('压缩图片失败:', error)
      return filePath
    }
  }

  /**
   * 删除保存的图片文件
   */
  async deleteSavedFile(filePath: string): Promise<void> {
    try {
      await Taro.removeSavedFile({ filePath })
    } catch (error) {
      console.error('删除文件失败:', error)
    }
  }
}

// 导出单例
export const storageService = new StorageService()
export default storageService
