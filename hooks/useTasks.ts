'use client'

import { useState, useEffect } from 'react'
import { supabase, Task } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useTasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetchTasks()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [...prev, payload.new as Task])
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(task => 
            task.id === payload.new.id ? payload.new as Task : task
          ))
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(task => task.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const createTask = async (taskData: Partial<Task>) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: user.id,
        ...taskData,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return null
    }

    return data
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return null
    }

    return data
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return false
    }

    return true
  }

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return null

    const updatedTask = await updateTask(id, { 
      status: task.status === 'completed' ? 'pending' : 'completed' 
    })

    // Update user stats if task was completed
    if (updatedTask && updatedTask.status === 'completed') {
      await updateUserStats()
    }

    return updatedTask
  }

  const updateUserStats = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      const today = new Date().toISOString().split('T')[0]
      const isNewDay = data.last_activity_date !== today
      
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({
          current_streak: isNewDay ? data.current_streak + 1 : data.current_streak,
          longest_streak: Math.max(data.longest_streak, isNewDay ? data.current_streak + 1 : data.current_streak),
          total_points: data.total_points + 10, // 10 points per completed task
          tasks_completed_today: isNewDay ? 1 : data.tasks_completed_today + 1,
          last_activity_date: today,
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating user stats:', updateError)
      }
    }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    refetch: fetchTasks,
  }
}