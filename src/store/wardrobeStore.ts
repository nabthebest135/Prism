import { create } from 'zustand'
import { localStorageDB } from '../lib/localStorage'
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
let queue = Promise.resolve()
function mutate(update: (items: ClothingItem[]) => ClothingItem[]) {
  const job = queue.then(async () => {
    const raw = await localStorageDB.getItem('wardrobe')
    const items = update(raw ? JSON.parse(raw) : [])
    await localStorageDB.setItem('wardrobe', JSON.stringify(items))
    useWardrobeStore.setState({ items })
  })
  queue = job.catch(() => {})
  return job
}
export const useWardrobeStore = create<WardrobeState>((set) => ({
  items: [],
  loading: false,
  fetchItems: async () => {
    set({ loading: true })
    try {
      await queue
      const raw = await localStorageDB.getItem('wardrobe')
      set({ items: raw ? JSON.parse(raw) : [] })
    } finally {
      set({ loading: false })
    }
  },
  addItem: (item) =>
    mutate((items) => [
      { ...item, id: crypto.randomUUID(), user_id: 'local', created_at: new Date().toISOString() },
      ...items,
    ]),
  removeItem: (id) => mutate((items) => items.filter((item) => item.id !== id)),
  updateItem: (id, updates) =>
    mutate((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...updates, id: item.id, user_id: item.user_id } : item
      )
    ),
}))
