'use client'

import { motion } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import Header from '@/components/Header'
import EisenhowerMatrix from '@/components/EisenhowerMatrix'
import StatsCard from '@/components/StatsCard'
import WeeklyInsights from '@/components/WeeklyInsights'

export default function Dashboard() {
  const { tasks, loading } = useTasks()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Dashboard
          </h2>
          <p className="text-muted-foreground">
            Organize your tasks using the Eisenhower Matrix methodology
          </p>
        </motion.div>

        <StatsCard />

        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Eisenhower Matrix
          </motion.h3>
          <EisenhowerMatrix tasks={tasks} />
        </div>

        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Weekly Insights
          </motion.h3>
          <WeeklyInsights tasks={tasks} />
        </div>
      </main>
    </div>
  )
}