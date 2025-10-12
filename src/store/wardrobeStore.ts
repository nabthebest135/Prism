import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface ClothingItem {
  id: string
  user_id: string
  name: string
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories'
  color: string
  image_url: string
  tags: string[]
  last_worn?: string
  created_at: string
}

interface WardrobeState {
  items: ClothingItem[]
  loading: boolean
  fetchItems: () => Promise<void>
  addItem: (item: Omit<ClothingItem, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateItem: (id: string, updates: Partial<ClothingItem>) => Promise<void>
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ items: data || [] })
    } catch (error) {
      console.error('Error fetching wardrobe items:', error)
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (item) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('clothing_items')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({ items: [data, ...state.items] }))
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  },

  removeItem: async (id) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set(state => ({ items: state.items.filter(item => item.id !== id) }))
    } catch (error) {
      console.error('Error removing item:', error)
      throw error
    }
  },

  updateItem: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({
        items: state.items.map(item => item.id === id ? data : item)
      }))
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }
}))