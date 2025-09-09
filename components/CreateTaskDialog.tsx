'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isImportant, setIsImportant] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [loading, setLoading] = useState(false)

  const { createTask } = useTasks()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        is_important: isImportant,
        is_urgent: isUrgent,
        due_date: dueDate?.toISOString() || null,
      })

      // Reset form
      setTitle('')
      setDescription('')
      setIsImportant(false)
      setIsUrgent(false)
      setDueDate(undefined)
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your Eisenhower Matrix. Set importance and urgency to categorize it properly.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="important"
                  checked={isImportant}
                  onCheckedChange={setIsImportant}
                />
                <Label htmlFor="important" className="text-sm font-medium">
                  Important
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="urgent"
                  checked={isUrgent}
                  onCheckedChange={setIsUrgent}
                />
                <Label htmlFor="urgent" className="text-sm font-medium">
                  Urgent
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Task will be placed in:</h4>
              <div className="text-sm text-muted-foreground">
                {isImportant && isUrgent && (
                  <span className="font-medium text-red-600">🔴 Do Now - Important & Urgent</span>
                )}
                {isImportant && !isUrgent && (
                  <span className="font-medium text-blue-600">🔵 Schedule - Important & Not Urgent</span>
                )}
                {!isImportant && isUrgent && (
                  <span className="font-medium text-yellow-600">🟡 Delegate - Not Important & Urgent</span>
                )}
                {!isImportant && !isUrgent && (
                  <span className="font-medium text-gray-600">⚪ Eliminate - Not Important & Not Urgent</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}