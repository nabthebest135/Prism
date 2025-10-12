import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://trcgxlfrkrtzcgbudnps.supabase.co'
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyY2d4bGZya3J0emNnYnVkbnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMzA5NjMsImV4cCI6MjA3NTgwNjk2M30.VyunlG3Cc5M9OGr_NC6q9I4k7zGAK4_eaVUMaPFs9qs'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)