import { create } from 'zustand'
import { Item } from '../types'
import { itemService } from '../services/itemService'

interface ItemState {
  items: Item[]
  loading: boolean
  
  // Actions
  loadItems: () => Promise<void>
  loadItemsByBox: (boxId: string) => Promise<void>
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  updateQuantity: (id: string, delta: number) => Promise<void>
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  loading: false,
  
  loadItems: async () => {
    set({ loading: true })
    const items = await itemService.getAll()
    set({ items, loading: false })
  },
  
  loadItemsByBox: async (boxId: string) => {
    set({ loading: true })
    const items = await itemService.getByBox(boxId)
    set({ items, loading: false })
  },
  
  addItem: async (itemData) => {
    const item = await itemService.add(itemData)
    set(state => ({ items: [...state.items, item] }))
  },
  
  updateItem: async (id, updates) => {
    await itemService.update(id, updates)
    set(state => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }))
  },
  
  deleteItem: async (id) => {
    await itemService.delete(id)
    set(state => ({
      items: state.items.filter(item => item.id !== id)
    }))
  },
  
  updateQuantity: async (id, delta) => {
    const item = get().items.find(i => i.id === id)
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta)
      if (newQuantity === 0) {
        await get().deleteItem(id)
      } else {
        await itemService.updateQuantity(id, delta)
        set(state => ({
          items: state.items.map(i => 
            i.id === id ? { ...i, quantity: newQuantity } : i
          )
        }))
      }
    }
  }
}))
