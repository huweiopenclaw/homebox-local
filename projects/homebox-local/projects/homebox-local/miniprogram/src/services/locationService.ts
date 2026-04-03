import Taro from '@tarojs/taro'
import { Location } from '../types'

const LOCATIONS_KEY = 'homebox_locations'

export const locationService = {
  async getAll(): Promise<Location[]> {
    try {
      const data = await Taro.getStorage({ key: LOCATIONS_KEY })
      return data.data || []
    } catch {
      return []
    }
  },

  async getById(id: string): Promise<Location | null> {
    const locations = await this.getAll()
    return locations.find(l => l.id === id) || null
  },

  async add(location: Omit<Location, 'id' | 'createdAt'>): Promise<Location> {
    const locations = await this.getAll()
    const newLocation: Location = {
      ...location,
      id: `loc-${Date.now()}`,
      createdAt: Date.now()
    }
    locations.push(newLocation)
    await Taro.setStorage({ key: LOCATIONS_KEY, data: locations })
    return newLocation
  },

  async update(id: string, updates: Partial<Location>): Promise<void> {
    const locations = await this.getAll()
    const index = locations.findIndex(l => l.id === id)
    if (index !== -1) {
      locations[index] = { ...locations[index], ...updates }
      await Taro.setStorage({ key: LOCATIONS_KEY, data: locations })
    }
  },

  async delete(id: string): Promise<void> {
    const locations = await this.getAll()
    const filtered = locations.filter(l => l.id !== id)
    await Taro.setStorage({ key: LOCATIONS_KEY, data: filtered })
  },

  async getByRoom(room: string): Promise<Location[]> {
    const locations = await this.getAll()
    return locations.filter(l => l.room === room)
  },

  async getAllRooms(): Promise<string[]> {
    const locations = await this.getAll()
    const rooms = new Set(locations.map(l => l.room))
    return Array.from(rooms)
  }
}
