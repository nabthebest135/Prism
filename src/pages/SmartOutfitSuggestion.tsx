import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Thermometer, MapPin, Sparkles, RefreshCw } from 'lucide-react'
import { useWardrobeStore } from '../store/wardrobeStore'
import { WeatherService, WeatherData } from '../services/weatherService'
import { WardrobeAnalysisService, OutfitAnalysis } from '../services/wardrobeAnalysisService'

const SmartOutfitSuggestion = () => {
  const navigate = useNavigate()
  const { items, fetchItems } = useWardrobeStore()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [suggestion, setSuggestion] = useState<OutfitAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('Your Location')

  const weatherService = new WeatherService()
  const analysisService = new WardrobeAnalysisService()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      await fetchItems()
      const weatherData = await weatherService.getCurrentWeather()
      setWeather(weatherData)
      
      // Use real location from weather API
      setLocation(`${weatherData.location}, ${weatherData.country}`)

      if (items.length > 0) {
        const outfitSuggestion = await analysisService.suggestOutfitForOccasion(
          items, 
          'daily casual', 
          { ...weatherData, location }
        )
        setSuggestion(outfitSuggestion)
      }
    } catch (error) {
      console.error('Error loading outfit suggestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600'
    if (temp >= 25) return 'text-orange-500'
    if (temp >= 15) return 'text-yellow-500'
    if (temp >= 5) return 'text-blue-500'
    return 'text-blue-700'
  }

  const getTemperatureAdvice = (temp: number) => {
    if (temp >= 40) return 'Extremely hot! Stay hydrated and wear minimal, breathable clothing'
    if (temp >= 35) return 'Very hot weather - light colors and breathable fabrics recommended'
    if (temp >= 30) return 'Hot day - choose light, loose-fitting clothes'
    if (temp >= 25) return 'Warm weather - comfortable casual wear works well'
    if (temp >= 20) return 'Pleasant temperature - perfect for most outfits'
    if (temp >= 15) return 'Cool weather - consider light layers'
    if (temp >= 10) return 'Chilly - warm layers recommended'
    return 'Cold weather - bundle up with heavy layers'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Smart Outfit</h1>
          <button
            onClick={loadData}
            className="text-primary hover:text-primary/80"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Weather Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin size={20} />
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer size={20} />
              <span className="text-2xl font-bold">
                {weather?.temperature || '--'}°C
              </span>
            </div>
          </div>
          <p className="text-sm opacity-90 capitalize">
            {weather?.description || 'Loading weather...'}
          </p>
          {weather && (
            <p className="text-xs opacity-75 mt-2">
              {getTemperatureAdvice(weather.temperature)}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : suggestion ? (
          <div className="space-y-6">
            {/* AI Recommendation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="text-accent" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Perfect for {weather?.temperature}°C
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 mb-4">
                <p className="font-medium text-gray-900 mb-2">Recommended Outfit:</p>
                <p className="text-gray-700">{suggestion.recommendation}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Selected Items:</h3>
                {suggestion.suggestedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Works */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Why This Works</h3>
              <p className="text-gray-600 leading-relaxed">{suggestion.reasoning}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Style Rating</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getTemperatureColor(weather?.temperature || 25)}`}>
                    {suggestion.styleRating}/10
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${suggestion.styleRating * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Temperature Guide */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Temperature Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600">40°C+ (Dubai Summer)</span>
                  <span className="text-gray-600">Minimal breathable clothing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-500">30-35°C (Hot Day)</span>
                  <span className="text-gray-600">Light cotton, linen</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-500">20-25°C (Perfect)</span>
                  <span className="text-gray-600">Comfortable casual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-500">10-15°C (Cool)</span>
                  <span className="text-gray-600">Light layers, jacket</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Add items to your wardrobe to get personalized suggestions</p>
            <button
              onClick={() => navigate('/style-lens')}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium"
            >
              Add Wardrobe Items
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartOutfitSuggestion