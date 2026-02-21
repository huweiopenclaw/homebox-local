/**
 * 物品服务 - 物品数据操作
 */

import type { Item, Box, RecognizedItem } from '../types'
import { storageService } from './storageService'

export interface ItemWithBox extends Item {
  box?: Box
}

export interface ItemFilter {
  boxId?: string
  category?: string
  keyword?: string
  tags?: string[]
}

export interface ItemStats {
  total: number
  byCategory: Record<string, number>
  byBox: Record<string, number>
}

export interface CreateItemData {
  boxId: string
  name: string
  category?: string
  quantity: number
  photoPath?: string
  notes?: string
  tags?: string[]
}

class ItemService {
  /**
   * 获取所有物品
   */
  async getAll(): Promise<Item[]> {
    return await storageService.getItems()
  }

  /**
   * 根据 ID 获取物品
   */
  async getById(id: string): Promise<Item | null> {
    return await storageService.getItemById(id)
  }

  /**
   * 获取物品详情（包含箱子信息）
   */
  async getDetailById(id: string): Promise<ItemWithBox | null> {
    const item = await this.getById(id)
    if (!item) return null

    const box = await storageService.getBoxById(item.boxId)
    return {
      ...item,
      box: box || undefined,
    }
  }

  /**
   * 获取物品列表（带筛选）
   */
  async getList(filter?: ItemFilter): Promise<Item[]> {
    let items = await this.getAll()

    if (filter) {
      if (filter.boxId) {
        items = items.filter(i => i.boxId === filter.boxId)
      }
      if (filter.category) {
        items = items.filter(i => i.category === filter.category)
      }
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase()
        items = items.filter(i =>
          i.name.toLowerCase().includes(keyword) ||
          i.notes?.toLowerCase().includes(keyword) ||
          i.tags?.some(tag => tag.toLowerCase().includes(keyword))
        )
      }
      if (filter.tags && filter.tags.length > 0) {
        items = items.filter(i =>
          filter.tags!.some(tag => i.tags?.includes(tag))
        )
      }
    }

    // 按更新时间倒序
    return items.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  /**
   * 获取带箱子信息的物品列表
   */
  async getListWithBox(filter?: ItemFilter): Promise<ItemWithBox[]> {
    const items = await this.getList(filter)
    const boxes = await storageService.getBoxes()

    return items.map(item => ({
      ...item,
      box: boxes.find(b => b.id === item.boxId),
    }))
  }

  /**
   * 创建物品
   */
  async create(data: CreateItemData): Promise<Item> {
    const item: Item = {
      id: this.generateId(),
      boxId: data.boxId,
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      photoPath: data.photoPath,
      notes: data.notes,
      tags: data.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await storageService.addItem(item)
    return item
  }

  /**
   * 批量创建物品（用于 AI 识别结果）
   */
  async batchCreateFromRecognized(
    boxId: string,
    recognizedItems: RecognizedItem[]
  ): Promise<Item[]> {
    const items: Item[] = recognizedItems.map(recognized => ({
      id: this.generateId(),
      boxId,
      name: recognized.name,
      category: recognized.category,
      quantity: recognized.quantity,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }))

    await storageService.addItems(items)
    return items
  }

  /**
   * 更新物品
   */
  async update(id: string, data: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item | null> {
    const item = await this.getById(id)
    if (!item) return null

    const updated: Item = {
      ...item,
      ...data,
      id,
      createdAt: item.createdAt,
      updatedAt: Date.now(),
    }

    await storageService.updateItem(updated)
    return updated
  }

  /**
   * 更新物品数量
   */
  async updateQuantity(id: string, quantity: number): Promise<Item | null> {
    return await this.update(id, { quantity })
  }

  /**
   * 增加物品数量
   */
  async increaseQuantity(id: string, amount: number = 1): Promise<Item | null> {
    const item = await this.getById(id)
    if (!item) return null
    return await this.update(id, { quantity: item.quantity + amount })
  }

  /**
   * 减少物品数量
   */
  async decreaseQuantity(id: string, amount: number = 1): Promise<Item | null> {
    const item = await this.getById(id)
    if (!item) return null
    const newQuantity = Math.max(0, item.quantity - amount)
    return await this.update(id, { quantity: newQuantity })
  }

  /**
   * 移动物品到另一个箱子
   */
  async moveToBox(id: string, targetBoxId: string): Promise<Item | null> {
    return await this.update(id, { boxId: targetBoxId })
  }

  /**
   * 批量移动物品
   */
  async batchMoveToBox(itemIds: string[], targetBoxId: string): Promise<void> {
    for (const id of itemIds) {
      await this.moveToBox(id, targetBoxId)
    }
  }

  /**
   * 删除物品
   */
  async delete(id: string): Promise<void> {
    // 获取物品关联的图片路径
    const item = await this.getById(id)
    
    // 删除物品
    await storageService.deleteItem(id)

    // 删除物品图片
    if (item?.photoPath) {
      await storageService.deleteSavedFile(item.photoPath)
    }
  }

  /**
   * 批量删除物品
   */
  async batchDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }

  /**
   * 搜索物品
   */
  async search(keyword: string): Promise<ItemWithBox[]> {
    const items = await storageService.searchItems(keyword)
    const boxes = await storageService.getBoxes()

    return items.map(item => ({
      ...item,
      box: boxes.find(b => b.id === item.boxId),
    }))
  }

  /**
   * 获取物品统计
   */
  async getStats(): Promise<ItemStats> {
    const items = await this.getAll()
    const boxes = await storageService.getBoxes()

    const byCategory: Record<string, number> = {}
    const byBox: Record<string, number> = {}

    for (const item of items) {
      // 按分类统计
      const category = item.category || '未分类'
      byCategory[category] = (byCategory[category] || 0) + 1

      // 按箱子统计
      byBox[item.boxId] = (byBox[item.boxId] || 0) + 1
    }

    return {
      total: items.length,
      byCategory,
      byBox,
    }
  }

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<string[]> {
    const items = await this.getAll()
    const categories = new Set<string>()
    
    for (const item of items) {
      if (item.category) {
        categories.add(item.category)
      }
    }

    return Array.from(categories).sort()
  }

  /**
   * 获取所有标签
   */
  async getTags(): Promise<string[]> {
    const items = await this.getAll()
    const tags = new Set<string>()
    
    for (const item of items) {
      if (item.tags) {
        for (const tag of item.tags) {
          tags.add(tag)
        }
      }
    }

    return Array.from(tags).sort()
  }

  /**
   * 根据箱子 ID 获取物品
   */
  async getByBoxId(boxId: string): Promise<Item[]> {
    return await storageService.getItemsByBoxId(boxId)
  }

  /**
   * 检查物品是否属于指定箱子
   */
  async belongsToBox(itemId: string, boxId: string): Promise<boolean> {
    const item = await this.getById(itemId)
    return item?.boxId === boxId
  }

  /**
   * 复制物品
   */
  async copy(id: string, targetBoxId?: string): Promise<Item | null> {
    const item = await this.getById(id)
    if (!item) return null

    const newItem: Item = {
      ...item,
      id: this.generateId(),
      boxId: targetBoxId || item.boxId,
      name: `${item.name} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await storageService.addItem(newItem)
    return newItem
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 导出单例
export const itemService = new ItemService()
export default itemService
