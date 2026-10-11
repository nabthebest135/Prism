import { create } from 'zustand'
import { localStorageDB } from '../lib/localStorage'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AnalysisResult {
  id: string
  type: 'translation' | 'outfit' | 'aging' | 'discovery' | 'scan'
  result: string
  image?: string
  timestamp: number
  mode?: string
  saved?: boolean
}

interface HistoryStore {
  analyses: AnalysisResult[]
  addAnalysis: (analysis: Omit<AnalysisResult, 'id' | 'timestamp'>) => void
  toggleSaved: (id: string) => void
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
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }

        set((state) => ({
          analyses: [newAnalysis, ...state.analyses].slice(0, 50), // Keep only last 50
        }))
      },

      toggleSaved: (id) =>
        set((state) => ({
          analyses: state.analyses.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a)),
        })),
      clearHistory: () => set({ analyses: [] }),

      getRecentAnalyses: (limit = 10) => {
        return get().analyses.slice(0, limit)
      },
    }),
    {
      name: 'prism-history',
      storage: createJSONStorage(() => localStorageDB),
    }
  )
)
