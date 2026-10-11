import { create } from 'zustand'
interface User {
  id: string
  name: string
  email: string
}
interface AuthState {
  user: User | null | undefined
  loading: boolean
  initialize: () => Promise<void>
  setName: (name: string) => void
  signOut: () => Promise<void>
}
export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  loading: false,
  initialize: async () => {
    const name = localStorage.getItem('prism-name')
    set({ user: name ? { id: 'local', name, email: 'Stored on this device' } : null })
  },
  setName: (name) => {
    const trimmed = name.trim() || 'Explorer'
    localStorage.setItem('prism-name', trimmed)
    set({ user: { id: 'local', name: trimmed, email: 'Stored on this device' } })
  },
  signOut: async () => {
    localStorage.removeItem('prism-name')
    set({ user: null })
  },
}))
