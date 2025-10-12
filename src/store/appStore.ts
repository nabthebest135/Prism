import { create } from 'zustand'
import { WeatherData, WeatherService } from '../services/weatherService'
import { CalendarEvent, CalendarService } from '../services/calendarService'

interface AppState {
  weather: WeatherData | null
  todaysEvents: CalendarEvent[]
  loading: boolean
  lastUpdated: Date | null
  
  // Actions
  fetchWeather: () => Promise<void>
  fetchCalendarEvents: () => Promise<void>
  refreshData: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  weather: null,
  todaysEvents: [],
  loading: false,
  lastUpdated: null,

  fetchWeather: async () => {
    try {
      const weatherService = new WeatherService()
      const weather = await weatherService.getCurrentWeather()
      set({ weather, lastUpdated: new Date() })
    } catch (error) {
      console.error('Error fetching weather:', error)
    }
  },

  fetchCalendarEvents: async () => {
    try {
      const calendarService = new CalendarService()
      const events = await calendarService.getTodaysEvents()
      set({ todaysEvents: events })
    } catch (error) {
      console.error('Error fetching calendar events:', error)
    }
  },

  refreshData: async () => {
    set({ loading: true })
    try {
      await Promise.all([
        get().fetchWeather(),
        get().fetchCalendarEvents()
      ])
    } finally {
      set({ loading: false })
    }
  }
}))