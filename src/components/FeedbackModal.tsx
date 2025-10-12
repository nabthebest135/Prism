import { useState } from 'react'
import { X, Star, Send } from 'lucide-react'
import { useFeedbackStore } from '../store/feedbackStore'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [feature, setFeature] = useState('')
  const [userName, setUserName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const { addFeedback } = useFeedbackStore()

  const features = [
    'World Lens',
    'Style Lens', 
    'Aging Predictor',
    'AI Stylist',
    'Translation',
    'Overall App'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || !message.trim()) return

    addFeedback({
      rating,
      message: message.trim(),
      feature: feature || 'Overall App',
      userName: userName.trim() || undefined
    })

    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setRating(0)
      setMessage('')
      setFeature('')
      setUserName('')
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 w-full max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
            <p className="text-gray-600">Your feedback helps us improve Prism!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share Your Feedback</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which feature are you reviewing?
                </label>
                <select
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a feature</option>
                  {features.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more about your experience
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did you love? What could be better?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Sarah M."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || !message.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Submit Feedback</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal