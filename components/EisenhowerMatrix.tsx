'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/lib/supabase'
import { useTasks } from '@/hooks/useTasks'
import TaskCard from './TaskCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SortableTaskProps {
  task: Task
}

function SortableTask({ task }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab active:cursor-grabbing"
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  )
}

interface QuadrantProps {
  title: string
  description: string
  color: string
  tasks: Task[]
  isImportant: boolean
  isUrgent: boolean
}

function Quadrant({ title, description, color, tasks, isImportant, isUrgent }: QuadrantProps) {
  return (
    <Card className={`h-full backdrop-blur-sm border-white/20 shadow-lg ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 min-h-[300px]">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface EisenhowerMatrixProps {
  tasks: Task[]
}

export default function EisenhowerMatrix({ tasks }: EisenhowerMatrixProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const { updateTask } = useTasks()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Categorize tasks based on importance and urgency
  const doNowTasks = tasks.filter(task => task.is_important && task.is_urgent && task.status !== 'completed')
  const scheduleTasks = tasks.filter(task => task.is_important && !task.is_urgent && task.status !== 'completed')
  const delegateTasks = tasks.filter(task => !task.is_important && task.is_urgent && task.status !== 'completed')
  const eliminateTasks = tasks.filter(task => !task.is_important && !task.is_urgent && task.status !== 'completed')

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const quadrant = over.id as string

    // Determine new importance and urgency based on quadrant
    let newImportant = false
    let newUrgent = false

    switch (quadrant) {
      case 'do-now':
        newImportant = true
        newUrgent = true
        break
      case 'schedule':
        newImportant = true
        newUrgent = false
        break
      case 'delegate':
        newImportant = false
        newUrgent = true
        break
      case 'eliminate':
        newImportant = false
        newUrgent = false
        break
    }

    // Update task if it changed quadrants
    const task = tasks.find(t => t.id === taskId)
    if (task && (task.is_important !== newImportant || task.is_urgent !== newUrgent)) {
      updateTask(taskId, {
        is_important: newImportant,
        is_urgent: newUrgent,
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SortableContext items={doNowTasks} strategy={verticalListSortingStrategy}>
            <div id="do-now">
              <Quadrant
                title="🔴 Do Now"
                description="Important & Urgent - Handle immediately"
                color="bg-red-50/80 dark:bg-red-900/20 border-red-200/50"
                tasks={doNowTasks}
                isImportant={true}
                isUrgent={true}
              />
            </div>
          </SortableContext>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SortableContext items={scheduleTasks} strategy={verticalListSortingStrategy}>
            <div id="schedule">
              <Quadrant
                title="🔵 Schedule"
                description="Important & Not Urgent - Plan ahead"
                color="bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/50"
                tasks={scheduleTasks}
                isImportant={true}
                isUrgent={false}
              />
            </div>
          </SortableContext>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SortableContext items={delegateTasks} strategy={verticalListSortingStrategy}>
            <div id="delegate">
              <Quadrant
                title="🟡 Delegate"
                description="Not Important & Urgent - Delegate if possible"
                color="bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200/50"
                tasks={delegateTasks}
                isImportant={false}
                isUrgent={true}
              />
            </div>
          </SortableContext>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SortableContext items={eliminateTasks} strategy={verticalListSortingStrategy}>
            <div id="eliminate">
              <Quadrant
                title="⚪ Eliminate"
                description="Not Important & Not Urgent - Consider removing"
                color="bg-gray-50/80 dark:bg-gray-800/50 border-gray-200/50"
                tasks={eliminateTasks}
                isImportant={false}
                isUrgent={false}
              />
            </div>
          </SortableContext>
        </motion.div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}