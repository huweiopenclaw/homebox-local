// 类型定义

// 箱子
export interface Box {
  id: string
  name: string
  description?: string
  locationId?: string
  photoPath?: string
  createdAt: number
  updatedAt: number
}

// 物品
export interface Item {
  id: string
  boxId: string
  name: string
  category?: string
  quantity: number
  photoPath?: string
  notes?: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

// 位置
export interface Location {
  id: string
  room: string
  furniture?: string
  position?: string
  photoPath?: string
  notes?: string
  createdAt: number
}

// AI 识别结果
export interface RecognizedItem {
  name: string
  quantity: number
  category?: string
}

// AI 配置
export interface AIConfig {
  provider: 'glm' | 'claude' | 'openai' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
}

// 搜索结果
export interface SearchResult {
  items: Item[]
  boxes: Box[]
  answer?: string
}
