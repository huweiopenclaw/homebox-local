import { create } from 'zustand'
import { Location } from '../types'
import { locationService } from '../services/locationService'

interface LocationState {
  locations: Location[]
  rooms: string[]
  loading: boolean
  
  // Actions
  loadLocations: () => Promise<void>
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => Promise<void>
  updateLocation: (id: string, updates: Partial<Location>) => Promise<void>
  deleteLocation: (id: string) => Promise<void>
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  rooms: [],
  loading: false,
  
  loadLocations: async () => {
    set({ loading: true })
    const locations = await locationService.getAll()
    const rooms = await locationService.getAllRooms()
    set({ locations, rooms, loading: false })
  },
  
  addLocation: async (locationData) => {
    const location = await locationService.add(locationData)
    set(state => {
      const newRooms = state.rooms.includes(location.room) 
        ? state.rooms 
        : [...state.rooms, location.room]
      return {
        locations: [...state.locations, location],
        rooms: newRooms
      }
    })
  },
  
  updateLocation: async (id, updates) => {
    await locationService.update(id, updates)
    set(state => {
      const locations = state.locations.map(loc => 
        loc.id === id ? { ...loc, ...updates } : loc
      )
      const rooms = [...new Set(locations.map(l => l.room))]
      return { locations, rooms }
    })
  },
  
  deleteLocation: async (id) => {
    await locationService.delete(id)
    set(state => {
      const locations = state.locations.filter(loc => loc.id !== id)
      const rooms = [...new Set(locations.map(l => l.room))]
      return { locations, rooms }
    })
  }
}))
