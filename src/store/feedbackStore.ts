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
      feedbacks: [],

      addFeedback: (feedback) => {
        const newFeedback: Feedback = {
          ...feedback,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }

        set((state) => ({
          feedbacks: [newFeedback, ...state.feedbacks],
        }))
      },

      getFeedbacks: () => get().feedbacks,

      getAverageRating: () => {
        const feedbacks = get().feedbacks
        if (feedbacks.length === 0) return 0
        const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
        return Math.round((sum / feedbacks.length) * 10) / 10
      },
    }),
    {
      name: 'prism-feedback',
    }
  )
)
