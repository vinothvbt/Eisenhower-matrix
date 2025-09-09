'use client'

import { useState, useEffect } from 'react'
import { supabase, UserStats } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useUserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetchStats()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('user_stats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setStats(payload.new as UserStats)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchStats = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user stats:', error)
    } else {
      setStats(data)
    }
    setLoading(false)
  }

  return {
    stats,
    loading,
    refetch: fetchStats,
  }
}