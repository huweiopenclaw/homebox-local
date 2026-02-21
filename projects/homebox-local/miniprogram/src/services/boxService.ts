/**
 * 箱子服务 - 箱子数据操作
 */

import type { Box, Item, Location } from '../types'
import { storageService } from './storageService'

export interface BoxWithItems extends Box {
  items: Item[]
  location?: Location
  itemCount: number
}

export interface BoxFilter {
  locationId?: string
  keyword?: string
}

export interface BoxStats {
  total: number
  withLocation: number
  withoutLocation: number
}

class BoxService {
  /**
   * 获取所有箱子
   */
  async getAll(): Promise<Box[]> {
    return await storageService.getBoxes()
  }

  /**
   * 根据 ID 获取箱子
   */
  async getById(id: string): Promise<Box | null> {
    return await storageService.getBoxById(id)
  }

  /**
   * 获取箱子详情（包含物品和位置）
   */
  async getDetailById(id: string): Promise<BoxWithItems | null> {
    const box = await this.getById(id)
    if (!box) return null

    const items = await this.getItemsByBoxId(id)
    const location = box.locationId 
      ? await storageService.getLocationById(box.locationId) 
      : undefined

    return {
      ...box,
      items,
      location,
      itemCount: items.length,
    }
  }

  /**
   * 获取箱子列表（带筛选）
   */
  async getList(filter?: BoxFilter): Promise<Box[]> {
    let boxes = await this.getAll()

    if (filter) {
      if (filter.locationId) {
        boxes = boxes.filter(b => b.locationId === filter.locationId)
      }
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase()
        boxes = boxes.filter(b => 
          b.name.toLowerCase().includes(keyword) ||
          b.description?.toLowerCase().includes(keyword)
        )
      }
    }

    // 按更新时间倒序
    return boxes.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  /**
   * 获取带物品数量的箱子列表
   */
  async getListWithItemCount(filter?: BoxFilter): Promise<BoxWithItems[]> {
    const boxes = await this.getList(filter)
    const allItems = await storageService.getItems()

    const result: BoxWithItems[] = await Promise.all(
      boxes.map(async box => {
        const items = allItems.filter(i => i.boxId === box.id)
        const location = box.locationId
          ? await storageService.getLocationById(box.locationId)
          : undefined

        return {
          ...box,
          items,
          location,
          itemCount: items.length,
        }
      })
    )

    return result
  }

  /**
   * 创建箱子
   */
  async create(data: Omit<Box, 'id' | 'createdAt' | 'updatedAt'>): Promise<Box> {
    const box: Box = {
      ...data,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await storageService.addBox(box)
    return box
  }

  /**
   * 更新箱子
   */
  async update(id: string, data: Partial<Omit<Box, 'id' | 'createdAt'>>): Promise<Box | null> {
    const box = await this.getById(id)
    if (!box) return null

    const updated: Box = {
      ...box,
      ...data,
      id,
      createdAt: box.createdAt,
      updatedAt: Date.now(),
    }

    await storageService.updateBox(updated)
    return updated
  }

  /**
   * 删除箱子（同时删除箱内物品）
   */
  async delete(id: string): Promise<void> {
    // 获取箱子关联的图片路径
    const box = await this.getById(id)
    
    // 删除箱子（会级联删除物品）
    await storageService.deleteBox(id)

    // 删除箱子图片
    if (box?.photoPath) {
      await storageService.deleteSavedFile(box.photoPath)
    }
  }

  /**
   * 设置箱子位置
   */
  async setLocation(boxId: string, locationId: string | undefined): Promise<Box | null> {
    return await this.update(boxId, { locationId })
  }

  /**
   * 获取箱子内的物品
   */
  async getItemsByBoxId(boxId: string): Promise<Item[]> {
    return await storageService.getItemsByBoxId(boxId)
  }

  /**
   * 获取箱子统计
   */
  async getStats(): Promise<BoxStats> {
    const boxes = await this.getAll()
    return {
      total: boxes.length,
      withLocation: boxes.filter(b => b.locationId).length,
      withoutLocation: boxes.filter(b => !b.locationId).length,
    }
  }

  /**
   * 搜索箱子
   */
  async search(keyword: string): Promise<Box[]> {
    const boxes = await this.getAll()
    const lowerKeyword = keyword.toLowerCase()
    
    return boxes.filter(box =>
      box.name.toLowerCase().includes(lowerKeyword) ||
      box.description?.toLowerCase().includes(lowerKeyword)
    )
  }

  /**
   * 批量更新箱子
   */
  async batchUpdate(boxes: Box[]): Promise<void> {
    const allBoxes = await this.getAll()
    const updatedBoxes = allBoxes.map(box => {
      const update = boxes.find(b => b.id === box.id)
      return update ? { ...update, updatedAt: Date.now() } : box
    })
    await storageService.saveBoxes(updatedBoxes)
  }

  /**
   * 检查箱子名称是否重复
   */
  async isNameExists(name: string, excludeId?: string): Promise<boolean> {
    const boxes = await this.getAll()
    return boxes.some(b => 
      b.name === name && b.id !== excludeId
    )
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `box_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 导出单例
export const boxService = new BoxService()
export default boxService
