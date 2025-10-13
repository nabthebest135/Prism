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
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        }
        set({ user: userData })
      } else {
        set({ user: null })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          }
          set({ user: userData })
        } else {
          set({ user: null })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ user: null })
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: undefined // Skip email confirmation
        }
      })
      
      if (error) throw error
      
      // User will be set via onAuthStateChange listener
      console.log('User signed up successfully')
    } catch (error) {
      set({ loading: false })
      throw error
    }
    set({ loading: false })
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      // User will be set via onAuthStateChange listener
    } catch (error) {
      set({ loading: false })
      throw error
    }
    set({ loading: false })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  }
}))