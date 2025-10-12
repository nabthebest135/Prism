import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnalysisResult {
  id: string
  type: 'translation' | 'outfit' | 'aging' | 'discovery' | 'scan'
  result: string
  image?: string
  timestamp: number
  mode?: string
}

interface HistoryStore {
  analyses: AnalysisResult[]
  addAnalysis: (analysis: Omit<AnalysisResult, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  getRecentAnalyses: (limit?: number) => AnalysisResult[]
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      analyses: [],
      
      addAnalysis: (analysis) => {
        const newAnalysis: AnalysisResult = {
          ...analysis,
          id: Date.now().toString(),
          timestamp: Date.now()
        }
        
        set((state) => ({
          analyses: [newAnalysis, ...state.analyses].slice(0, 50) // Keep only last 50
        }))
      },
      
      clearHistory: () => set({ analyses: [] }),
      
      getRecentAnalyses: (limit = 10) => {
        return get().analyses.slice(0, limit)
      }
    }),
    {
      name: 'prism-history'
    }
  )
)