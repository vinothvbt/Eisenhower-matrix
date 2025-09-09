'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Edit3, Check, X, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const { updateTask, deleteTask, completeTask } = useTasks()

  const handleSave = async () => {
    await updateTask(task.id, {
      title: title.trim() || task.title,
      description: description.trim(),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description)
    setIsEditing(false)
  }

  const handleComplete = async () => {
    await completeTask(task.id)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className={`
        backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300
        ${task.status === 'completed' ? 'opacity-75 bg-green-50/50 dark:bg-green-900/20' : 'bg-white/80 dark:bg-gray-800/80'}
      `}>
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold"
                placeholder="Task title..."
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[60px] resize-none"
                placeholder="Description (optional)..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold leading-tight ${task.status === 'completed' ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {task.is_important && (
                  <Badge variant="destructive" className="text-xs">
                    Important
                  </Badge>
                )}
                {task.is_urgent && (
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                    Urgent
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs capitalize">
                  {task.status}
                </Badge>
              </div>

              {task.due_date && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Due {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Created {format(new Date(task.created_at), 'MMM dd')}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant={task.status === 'completed' ? 'outline' : 'default'}
                  onClick={handleComplete}
                  className="h-8 flex-1"
                >
                  {task.status === 'completed' ? 'Undo' : 'Complete'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}