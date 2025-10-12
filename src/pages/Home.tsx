import { Link } from 'react-router-dom'
import { Camera, Shirt, MapPin, Sun, Calendar, Cloud, CloudRain } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { WeatherService, WeatherData } from '../services/weatherService'
import { CalendarService, CalendarEvent } from '../services/calendarService'

const Home = () => {
  const { user } = useAuthStore()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const weatherService = new WeatherService()
  const calendarService = new CalendarService()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherData, events] = await Promise.all([
          weatherService.getCurrentWeather(),
          calendarService.getTodaysEvents()
        ])
        setWeather(weatherData)
        setTodaysEvents(events)
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Explorer'}!
        </h1>
        <p className="text-gray-600 mt-1">Ready to discover the world around you?</p>
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Today's Weather</p>
            {loading ? (
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-bold">{weather?.temperature}°C</p>
                <p className="text-sm opacity-90 capitalize">{weather?.description}</p>
              </>
            )}
          </div>
          {weather?.condition === 'Clear' && <Sun size={48} className="opacity-80" />}
          {weather?.condition === 'Clouds' && <Cloud size={48} className="opacity-80" />}
          {weather?.condition === 'Rain' && <CloudRain size={48} className="opacity-80" />}
          {!weather && <Sun size={48} className="opacity-80" />}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/world-lens"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">World Lens</h3>
                <p className="text-sm text-gray-600">Translate & Discover</p>
              </div>
            </div>
          </Link>

          <Link
            to="/style-lens"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Shirt className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Style Lens</h3>
                <p className="text-sm text-gray-600">Wardrobe & Outfits</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Today's Outfit Suggestion */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Today's Outfit</h3>
          <Calendar size={20} className="text-gray-400" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Shirt className="text-gray-400" size={24} />
          </div>
          <div className="flex-1">
            {loading ? (
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-medium text-gray-900">
                  {todaysEvents.length > 0 ? 'Event Ready' : 'Weather Perfect'}
                </p>
                <p className="text-sm text-gray-600">
                  {weather ? weatherService.getOutfitRecommendation(weather) : 'Comfortable casual wear'}
                </p>
                {todaysEvents.length > 0 && (
                  <p className="text-xs text-primary mt-1">
                    {todaysEvents[0].title} at {todaysEvents[0].start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                )}
              </>
            )}
          </div>
          <Link
            to="/smart-outfit"
            className="text-primary font-medium text-sm"
          >
            Smart Pick
          </Link>
        </div>
      </div>

      {/* Outfit Analysis Quick Action */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Outfit Check</h3>
          <Camera size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 mb-4">Get AI-powered styling advice on your current outfit</p>
        <Link
          to="/outfit-analysis"
          className="w-full bg-accent text-white py-3 rounded-xl font-medium text-center block"
        >
          Analyze My Outfit
        </Link>
      </div>

      {/* Recent Discoveries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Discoveries</h3>
          <Link to="/discoveries" className="text-primary font-medium text-sm">
            View All
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <MapPin className="text-success" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Historic Building</p>
              <p className="text-sm text-gray-600">Discovered 2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home