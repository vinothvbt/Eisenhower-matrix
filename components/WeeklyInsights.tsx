'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Task } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface WeeklyInsightsProps {
  tasks: Task[]
}

export default function WeeklyInsights({ tasks }: WeeklyInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weeklyTasks = tasks.filter(task => 
      new Date(task.created_at) >= weekAgo
    )

    const quadrantData = [
      {
        name: 'Do Now',
        count: weeklyTasks.filter(t => t.is_important && t.is_urgent).length,
        color: '#EF4444',
      },
      {
        name: 'Schedule',
        count: weeklyTasks.filter(t => t.is_important && !t.is_urgent).length,
        color: '#3B82F6',
      },
      {
        name: 'Delegate',
        count: weeklyTasks.filter(t => !t.is_important && t.is_urgent).length,
        color: '#F59E0B',
      },
      {
        name: 'Eliminate',
        count: weeklyTasks.filter(t => !t.is_important && !t.is_urgent).length,
        color: '#6B7280',
      },
    ]

    const completedTasks = weeklyTasks.filter(t => t.status === 'completed').length
    const totalTasks = weeklyTasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Daily completion data for the week
    const dailyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.updated_at)
        return taskDate >= dayStart && taskDate < dayEnd && task.status === 'completed'
      })

      dailyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayTasks.length,
      })
    }

    return {
      quadrantData,
      completionRate,
      completedTasks,
      totalTasks,
      dailyData,
    }
  }, [tasks])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.quadrantData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={12} />
                  <Bar dataKey="count" radius={4}>
                    {insights.quadrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {insights.completionRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Completion Rate
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {insights.completedTasks} of {insights.totalTasks} tasks completed
                </div>
              </div>

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Bar 
                      dataKey="completed" 
                      fill="#10B981" 
                      radius={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}