import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Feedback {
  id: string
  rating: number
  message: string
  feature: string
  timestamp: number
  userName?: string
}

interface FeedbackStore {
  feedbacks: Feedback[]
  addFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void
  getFeedbacks: () => Feedback[]
  getAverageRating: () => number
}

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      feedbacks: [
        // Pre-populated testimonials
        {
          id: '1',
          rating: 5,
          message: "This app is incredible! The outfit aging predictor is mind-blowing - it actually predicted my jeans would fade at the knees and they did! 🤯",
          feature: 'Aging Predictor',
          timestamp: Date.now() - 86400000 * 7,
          userName: 'Sarah M.'
        },
        {
          id: '2', 
          rating: 5,
          message: "Finally an app that knows my actual wardrobe! The AI styling advice is spot-on and saves me so much time getting dressed. Love it! ❤️",
          feature: 'Style Lens',
          timestamp: Date.now() - 86400000 * 5,
          userName: 'Mike R.'
        },
        {
          id: '3',
          rating: 5,
          message: "The translation feature is amazing for traveling! Works perfectly even in low light. This app is a game-changer! 🌟",
          feature: 'World Lens',
          timestamp: Date.now() - 86400000 * 3,
          userName: 'Emma L.'
        },
        {
          id: '4',
          rating: 4,
          message: "Love how the AI gives honest fashion opinions! It's like having a stylish friend who's always available. Great work! 👏",
          feature: 'AI Stylist',
          timestamp: Date.now() - 86400000 * 2,
          userName: 'Alex K.'
        }
      ],
      
      addFeedback: (feedback) => {
        const newFeedback: Feedback = {
          ...feedback,
          id: Date.now().toString(),
          timestamp: Date.now()
        }
        
        set((state) => ({
          feedbacks: [newFeedback, ...state.feedbacks]
        }))
      },
      
      getFeedbacks: () => get().feedbacks,
      
      getAverageRating: () => {
        const feedbacks = get().feedbacks
        if (feedbacks.length === 0) return 0
        const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
        return Math.round((sum / feedbacks.length) * 10) / 10
      }
    }),
    {
      name: 'prism-feedback'
    }
  )
)