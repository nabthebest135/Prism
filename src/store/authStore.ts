import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthState {
  user: User | null | undefined
  loading: boolean
  initialize: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  loading: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ user: { id: session.user.id, email: session.user.email! } })
      } else {
        set({ user: null })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ user: null })
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        set({ user: { id: data.user.id, email: data.user.email!, name } })
      }
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user) {
        set({ user: { id: data.user.id, email: data.user.email! } })
      }
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  }
}))