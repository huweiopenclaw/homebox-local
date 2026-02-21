import { create } from 'zustand'
import { Box, Item } from '../types'

interface BoxState {
  boxes: Box[]
  loading: boolean
  
  // Actions
  loadBoxes: () => Promise<void>
  addBox: (box: Box) => void
  updateBox: (box: Box) => void
  deleteBox: (id: string) => void
}

// 模拟本地存储
const STORAGE_KEY = 'homebox_boxes'

const getStoredBoxes = (): Box[] => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const setStoredBoxes = (boxes: Box[]) => {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(boxes))
}

export const useBoxStore = create<BoxState>((set, get) => ({
  boxes: [],
  loading: false,
  
  loadBoxes: async () => {
    set({ loading: true })
    const boxes = getStoredBoxes()
    set({ boxes, loading: false })
  },
  
  addBox: (box) => {
    const boxes = [...get().boxes, box]
    setStoredBoxes(boxes)
    set({ boxes })
  },
  
  updateBox: (box) => {
    const boxes = get().boxes.map(b => b.id === box.id ? box : b)
    setStoredBoxes(boxes)
    set({ boxes })
  },
  
  deleteBox: (id) => {
    const boxes = get().boxes.filter(b => b.id !== id)
    setStoredBoxes(boxes)
    set({ boxes })
  }
}))
