import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Languages, MapPin, Scan } from 'lucide-react'
import CameraView from '../components/CameraView'
import { AIService } from '../services/aiService'
import { useHistoryStore } from '../store/historyStore'

type LensMode = 'translate' | 'discover' | 'scan'

const WorldLens = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<LensMode>('translate')
  const [overlayText, setOverlayText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const { addAnalysis } = useHistoryStore()
  const aiService = new AIService()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ]

  const modes = [
    { id: 'translate' as LensMode, icon: Languages, label: 'Translate' },
    { id: 'discover' as LensMode, icon: MapPin, label: 'Discover' },
    { id: 'scan' as LensMode, icon: Scan, label: 'Scan' }
  ]

  const handleCapture = async (imageBase64: string) => {
    console.log('WorldLens - Capture triggered')
    console.log('WorldLens - Image data received:', imageBase64 ? 'Yes' : 'No')
    console.log('WorldLens - Image size:', imageBase64?.length || 0)
    
    if (!imageBase64) {
      setOverlayText('Camera capture failed. Please try again.')
      setTimeout(() => setOverlayText(''), 3000)
      return
    }
    
    setIsProcessing(true)
    try {
      // Test API connection first
      setOverlayText('Testing API connection...')
      const connectionTest = await aiService.testConnection()
      if (!connectionTest) {
        setOverlayText('X API key not loaded or invalid. Environment variable issue.')
        setTimeout(() => setOverlayText(''), 8000)
        return
      }
      setOverlayText('✓ API connected. Analyzing image...')
      
      let prompt = ''
      
      switch (mode) {
        case 'translate':
          const selectedLang = languages.find(l => l.code === targetLanguage)?.name || 'English'
          prompt = `Identify and translate any text in this image to ${selectedLang}. If no text is found, say "No text detected".`
          break
        case 'discover':
          prompt = 'Identify any landmarks, buildings, or notable locations in this image and provide interesting historical or cultural information.'
          break
        case 'scan':
          prompt = 'Identify the main object in this image and provide useful information, instructions, or interesting facts about it.'
          break
      }

      console.log('WorldLens - Starting AI analysis with mode:', mode)
      console.log('WorldLens - Prompt:', prompt)
      
      const response = await aiService.analyzeImage(imageBase64, prompt)
      console.log('WorldLens - Full AI response:', response)
      
      const result = response.choices?.[0]?.message?.content || 'No information available'
      
      console.log('WorldLens - Extracted result:', result)
      setOverlayText(result)
      
      // Save to history
      addAnalysis({
        type: mode === 'translate' ? 'translation' : mode === 'discover' ? 'discovery' : 'scan',
        result,
        image: `data:image/jpeg;base64,${imageBase64}`,
        mode: mode
      })
      
      // Clear overlay after 15 seconds (longer display time)
      setTimeout(() => setOverlayText(''), 15000)
    } catch (error) {
      console.error('WorldLens - AI analysis error details:', error)
      
      // Show detailed error in UI for mobile debugging
      let errorMsg = 'X Analysis failed'
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMsg = 'X API key invalid or expired'
        } else if (error.message.includes('403')) {
          errorMsg = 'X API access forbidden - check credits'
        } else if (error.message.includes('429')) {
          errorMsg = 'X Rate limit exceeded - try again later'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg = 'X Network error - check internet'
        } else {
          errorMsg = `X Error: ${error.message.substring(0, 100)}`
        }
      }
      
      setOverlayText(errorMsg)
      setTimeout(() => setOverlayText(''), 8000)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <CameraView
      title="World Lens"
      onBack={() => navigate('/')}
      onCapture={handleCapture}
    >
      {/* Mode Selector */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="flex justify-center space-x-2">
          {modes.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                console.log('Mode button clicked:', id)
                setMode(id)
              }}
              onTouchStart={() => {
                console.log('Mode button touched:', id)
                setMode(id)
              }}
              className={`flex items-center space-x-2 mode-button ${
                mode === id
                  ? 'mode-button-active'
                  : 'mode-button-inactive'
              }`}
              style={{ touchAction: 'manipulation' }}
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
          <div className="glass-card px-8 py-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <span className="text-gray-800 font-medium">AI is thinking...</span>
                <p className="text-sm text-gray-600 mt-1">🤖 Analyzing your image</p>
              </div>
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

      {/* Language Selector for Translate Mode */}
      {mode === 'translate' && (
        <div className="absolute top-32 left-4 right-4 z-20">
          <div className="text-center">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="glass-card px-4 py-3 text-gray-800 font-medium shadow-lg"
            >
              🌍 Translate to: {languages.find(l => l.code === targetLanguage)?.name}
            </button>
            
            {showLanguageSelector && (
              <div className="mt-3 glass-card p-2 max-h-48 overflow-y-auto">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setTargetLanguage(lang.code)
                      setShowLanguageSelector(false)
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      targetLanguage === lang.code 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode Instructions */}
      <div className="absolute bottom-32 left-4 right-4 z-10">
        <div className="text-center">
          <div className="glass-card px-6 py-3 inline-block">
            <p className="text-gray-800 text-sm font-medium">
              {mode === 'translate' && `📷 Point at text to translate to ${languages.find(l => l.code === targetLanguage)?.name}`}
              {mode === 'discover' && '🏰 Point at landmarks to discover their history'}
              {mode === 'scan' && '🔍 Point at objects to learn more about them'}
            </p>
          </div>
        </div>
      </div>


    </CameraView>
  )
}

export default WorldLens