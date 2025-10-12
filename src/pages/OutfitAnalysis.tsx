import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Sparkles, TrendingUp } from 'lucide-react'
import CameraView from '../components/CameraView'
import { WardrobeAnalysisService, OutfitAnalysis } from '../services/wardrobeAnalysisService'
import { useWardrobeStore } from '../store/wardrobeStore'

const OutfitAnalysisPage = () => {
  const navigate = useNavigate()
  const { items } = useWardrobeStore()
  const [analysis, setAnalysis] = useState<OutfitAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showCamera, setShowCamera] = useState(true)
  
  const analysisService = new WardrobeAnalysisService()

  const handleAnalyzeOutfit = async (imageBase64: string) => {
    setIsAnalyzing(true)
    try {
      const result = await analysisService.analyzeCurrentOutfit(imageBase64, items)
      setAnalysis(result)
      setShowCamera(false)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStyleRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (showCamera) {
    return (
      <CameraView
        title="Analyze Your Outfit"
        onBack={() => navigate('/')}
        onCapture={handleAnalyzeOutfit}
      >
        {/* Processing Indicator */}
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-black/70 text-white px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing your style...</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-32 left-4 right-4 z-10">
          <div className="text-center">
            <p className="text-white text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
              Take a photo of your current outfit for AI styling advice
            </p>
          </div>
        </div>
      </CameraView>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Outfit Analysis</h1>
        <button
          onClick={() => setShowCamera(true)}
          className="text-primary hover:text-primary/80"
        >
          <Camera size={24} />
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Style Rating */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Style Rating</h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-primary" size={20} />
                <span className={`text-2xl font-bold ${getStyleRatingColor(analysis.styleRating)}`}>
                  {analysis.styleRating}/10
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.styleRating * 10}%` }}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="text-accent" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Recommendation</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{analysis.recommendation}</p>
            
            {analysis.reasoning && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Why this works:</h3>
                <p className="text-sm text-gray-600">{analysis.reasoning}</p>
              </div>
            )}
          </div>

          {/* Suggested Items */}
          {analysis.suggestedItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Items</h2>
              <div className="space-y-2">
                {analysis.suggestedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Score */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Analysis Confidence</span>
              <span className="font-semibold text-gray-900">
                {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div 
                className="bg-success h-1 rounded-full"
                style={{ width: `${analysis.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCamera(true)}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium"
            >
              Analyze Another Outfit
            </button>
            <button
              onClick={() => navigate('/wardrobe')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
            >
              View Wardrobe
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutfitAnalysisPage