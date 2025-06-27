import { createClient } from '@supabase/supabase-js'

// Use fallback values for localhost development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'scoresweep-demo'
    }
  }
})

export type WaitlistEntry = {
  id?: string
  name: string
  email: string
  note?: string
  status?: string
  created_at?: string
}