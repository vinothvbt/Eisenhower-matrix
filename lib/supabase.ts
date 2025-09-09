import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Task = {
  id: string
  user_id: string
  title: string
  description: string
  is_important: boolean
  is_urgent: boolean
  status: 'pending' | 'completed' | 'archived'
  due_date: string | null
  created_at: string
  updated_at: string
}

export type UserStats = {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  total_points: number
  tasks_completed_today: number
  last_activity_date: string
  created_at: string
  updated_at: string
}