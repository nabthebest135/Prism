import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Shirt, Sparkles, Cloud } from 'lucide-react'
import CameraView from '../components/CameraView'
import WardrobeSetup from '../components/WardrobeSetup'
import { AIService } from '../services/aiService'
import { WeatherService } from '../services/weatherService'
import { useWardrobeStore } from '../store/wardrobeStore'

type StyleMode = 'scan' | 'tryOn' | 'outfit'

const StyleLens = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<StyleMode>('scan')
  const [isProcessing, setIsProcessing] = useState(false)
  const [overlayText, setOverlayText] = useState<string>('')
  const [showWardrobeSetup, setShowWardrobeSetup] = useState(false)
  const [userWardrobe, setUserWardrobe] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const { addItem } = useWardrobeStore()
  const aiService = new AIService()
  const weatherService = new WeatherService()

  useEffect(() => {
    // Get weather data
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weatherData = await weatherService.getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude
          )
          setWeather(weatherData)
        } catch (error) {
          console.error('Weather fetch failed:', error)
        }
      },
      (error) => console.error('Geolocation failed:', error)
    )
  }, [])

  const modes = [
    { id: 'scan' as StyleMode, icon: Plus, label: 'Add Item' },
    { id: 'tryOn' as StyleMode, icon: Shirt, label: 'Try On' },
    { id: 'outfit' as StyleMode, icon: Sparkles, label: 'Outfit' }
  ]

  const handleCapture = async (imageBase64: string) => {
    setIsProcessing(true)
    try {
      if (mode === 'scan') {
        const prompt = `Analyze this clothing item and provide:
        1. Item type (tops/bottoms/shoes/accessories)
        2. Primary color
        3. Brief description
        4. Suggested tags (style, occasion, season)
        
        Format as JSON: {"type": "tops", "color": "blue", "description": "...", "tags": ["casual", "summer"]}`

        const response = await aiService.analyzeImage(imageBase64, prompt)
        const result = response.choices?.[0]?.message?.content || ''
        
        try {
          const itemData = JSON.parse(result)
          
          // Create clothing item
          const newItem = {
            name: itemData.description || 'New Item',
            category: itemData.type || 'tops',
            color: itemData.color || 'unknown',
            image_url: `data:image/jpeg;base64,${imageBase64}`,
            tags: itemData.tags || []
          }
          
          await addItem(newItem)
          setOverlayText('Item added to wardrobe!')
          
          setTimeout(() => {
            navigate('/wardrobe')
          }, 2000)
        } catch (parseError) {
          setOverlayText('Item analyzed! Check your wardrobe.')
          setTimeout(() => navigate('/wardrobe'), 2000)
        }
      } else if (mode === 'tryOn') {
        setOverlayText('Virtual try-on coming soon!')
        setTimeout(() => setOverlayText(''), 3000)
      } else if (mode === 'outfit') {
        if (!userWardrobe) {
          setShowWardrobeSetup(true)
          setIsProcessing(false)
          return
        }
        
        const wardrobeText = `Available items:\n` +
          `Tops: ${userWardrobe.tops.map(item => `${item.color} ${item.name}`).join(', ')}\n` +
          `Bottoms: ${userWardrobe.bottoms.map(item => `${item.color} ${item.name}`).join(', ')}\n` +
          `Shoes: ${userWardrobe.shoes.map(item => `${item.color} ${item.name}`).join(', ')}`
        
        const weatherText = weather ? 
          `Current weather: ${weather.condition}, ${Math.round(weather.temp_c)}°C (${Math.round(weather.temp_f)}°F)` : 
          'Weather data not available'
        
        const prompt = `You are a professional fashion stylist. Based on this image, current weather, and my wardrobe below, give me:\n\n` +
          `${weatherText}\n\n` +
          `${wardrobeText}\n\n` +
          `1. A complete outfit recommendation using ONLY items from my wardrobe (consider the weather!)\n` +
          `2. Your honest fashion opinion about the combination\n` +
          `3. Color coordination advice\n` +
          `4. Styling tips to make it look better\n` +
          `5. What occasion this outfit would be perfect for\n` +
          `6. Weather appropriateness rating (1-10)\n\n` +
          `Be specific about colors and give me your professional opinion!`
        
        const response = await aiService.analyzeImage(imageBase64, prompt)
        const result = response.choices?.[0]?.message?.content || 'No suggestions available'
        
        setOverlayText(result)
        setTimeout(() => setOverlayText(''), 8000)
      }
    } catch (error) {
      console.error('Style analysis error:', error)
      setOverlayText('Analysis failed. Please try again.')
      setTimeout(() => setOverlayText(''), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {showWardrobeSetup && (
        <WardrobeSetup
          onComplete={(wardrobe) => {
            setUserWardrobe(wardrobe)
            setShowWardrobeSetup(false)
          }}
          onCancel={() => {
            setShowWardrobeSetup(false)
            setMode('scan')
          }}
        />
      )}
      
      <CameraView
        title="Style Lens"
        onBack={() => navigate('/')}
        onCapture={handleCapture}
      >
      {/* Mode Selector */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="flex justify-center space-x-2">
          {modes.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                mode === id
                  ? 'bg-white text-accent'
                  : 'bg-black/30 text-white border border-white/30'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-black/70 text-white px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {mode === 'scan' && 'Adding to wardrobe...'}
                {mode === 'tryOn' && 'Processing try-on...'}
                {mode === 'outfit' && 'Creating outfit...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AR Overlay Text */}
      {overlayText && (
        <div className="absolute bottom-32 left-4 right-4 z-20">
          <div className="ar-text-overlay max-w-sm mx-auto">
            <p className="text-sm leading-relaxed">{overlayText}</p>
          </div>
        </div>
      )}

      {/* Mode Instructions */}
      <div className="absolute bottom-32 left-4 right-4 z-10">
        <div className="text-center">
          <p className="text-white text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
            {mode === 'scan' && 'Point at clothing to add to wardrobe'}
            {mode === 'tryOn' && 'Point at clothes to try them on'}
            {mode === 'outfit' && 'Point at an item for outfit suggestions'}
          </p>
        </div>
      </div>
      </CameraView>
    </>
  )
}

export default StyleLens