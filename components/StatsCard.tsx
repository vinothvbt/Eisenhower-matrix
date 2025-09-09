'use client'

import { motion } from 'framer-motion'
import { useUserStats } from '@/hooks/useUserStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react'

export default function StatsCard() {
  const { stats, loading } = useUserStats()

  if (loading || !stats) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statsData = [
    {
      title: 'Current Streak',
      value: stats.current_streak,
      suffix: 'days',
      icon: Flame,
      color: 'text-orange-600',
    },
    {
      title: 'Longest Streak',
      value: stats.longest_streak,
      suffix: 'days',
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      title: 'Total Points',
      value: stats.total_points,
      suffix: 'pts',
      icon: Target,
      color: 'text-purple-600',
    },
    {
      title: 'Today Completed',
      value: stats.tasks_completed_today,
      suffix: 'tasks',
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ]

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 rounded-lg bg-muted/30"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold">
                {stat.value}
                <span className="text-sm text-muted-foreground ml-1">
                  {stat.suffix}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Productivity Level</span>
            <Badge 
              variant={stats.total_points > 100 ? 'default' : 'secondary'}
              className={stats.total_points > 100 ? 'bg-gradient-to-r from-green-600 to-blue-600' : ''}
            >
              {stats.total_points > 500 ? 'Master' : 
               stats.total_points > 200 ? 'Expert' : 
               stats.total_points > 100 ? 'Advanced' : 
               stats.total_points > 50 ? 'Intermediate' : 'Beginner'}
            </Badge>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.total_points / 500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}