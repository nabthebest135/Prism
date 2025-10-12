import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MessageCircle, Users, TrendingUp } from 'lucide-react'
import { useFeedbackStore } from '../store/feedbackStore'
import FeedbackModal from '../components/FeedbackModal'

const Testimonials = () => {
  const navigate = useNavigate()
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const { feedbacks, getAverageRating } = useFeedbackStore()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getFeatureColor = (feature: string) => {
    switch (feature) {
      case 'World Lens': return 'bg-blue-100 text-blue-800'
      case 'Style Lens': return 'bg-purple-100 text-purple-800'
      case 'Aging Predictor': return 'bg-orange-100 text-orange-800'
      case 'AI Stylist': return 'bg-green-100 text-green-800'
      case 'Translation': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const averageRating = getAverageRating()
  const totalReviews = feedbacks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="glass-card rounded-none">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">User Reviews</h1>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium"
          >
            Write Review
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-yellow-400 fill-current" size={24} />
              <span className="text-2xl font-bold text-gray-900 ml-1">{averageRating}</span>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-gray-900 ml-1">{totalReviews}</span>
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-gray-900 ml-1">98%</span>
            </div>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">What users are saying 💬</h2>
          </div>
          
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {feedback.userName ? feedback.userName.charAt(0) : '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {feedback.userName || 'Anonymous User'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(feedback.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeatureColor(feedback.feature)}`}>
                  {feedback.feature}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="glass-card p-6 text-center">
          <MessageCircle className="mx-auto text-blue-500 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Love Prism? Share your experience!</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Your feedback helps us improve and helps other users discover our features.
          </p>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90"
          >
            Write a Review ⭐
          </button>
        </div>
      </div>

      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  )
}

export default Testimonials