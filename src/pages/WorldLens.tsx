import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Languages, MapPin, Scan } from 'lucide-react'
import CameraView from '../components/CameraView'
import { AIService } from '../services/aiService'

type LensMode = 'translate' | 'discover' | 'scan'

const WorldLens = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<LensMode>('translate')
  const [overlayText, setOverlayText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const aiService = new AIService()

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
      let prompt = ''
      
      switch (mode) {
        case 'translate':
          prompt = 'Identify and translate any text in this image to English. If no text is found, say "No text detected".'
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
      
      // Clear overlay after 5 seconds
      setTimeout(() => setOverlayText(''), 5000)
    } catch (error) {
      console.error('WorldLens - AI analysis error details:', error)
      console.error('WorldLens - Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('WorldLens - Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      // Show more specific error message
      const errorMsg = (error instanceof Error && error.message?.includes('API')) ? 'API connection failed' : 'Analysis failed. Please try again.'
      setOverlayText(errorMsg)
      setTimeout(() => setOverlayText(''), 3000)
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors touch-manipulation ${
                mode === id
                  ? 'bg-white text-primary'
                  : 'bg-black/30 text-white border border-white/30'
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
          <div className="bg-black/70 text-white px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
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
            {mode === 'translate' && 'Point at text to translate'}
            {mode === 'discover' && 'Point at landmarks to discover'}
            {mode === 'scan' && 'Point at objects to learn more'}
          </p>
        </div>
      </div>
    </CameraView>
  )
}

export default WorldLens