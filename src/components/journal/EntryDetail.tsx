"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react"

// Implement utility functions directly to avoid import issues

// Format date to readable string
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get time ago string from date
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`
  }
  
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`
  }
  
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`
  }
  
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`
  }
  
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`
  }
  
  return 'Just now'
}

// Define mood colors and icons
const MOOD_METADATA = {
  'Happy': { color: 'bg-yellow-100 border-yellow-300 text-yellow-700', icon: '😊' },
  'Sad': { color: 'bg-blue-100 border-blue-300 text-blue-700', icon: '😔' },
  'Anxious': { color: 'bg-purple-100 border-purple-300 text-purple-700', icon: '😰' },
  'Productive': { color: 'bg-green-100 border-green-300 text-green-700', icon: '💪' },
  'Neutral': { color: 'bg-gray-100 border-gray-300 text-gray-700', icon: '😐' }
}

interface EntryDetailProps {
  entry: {
    id: number
    title: string
    content: string
    mood: string
    tags: string[]
    createdAt: string
    lastEdited: string
  }
  onEdit: (entry: any) => void
  onDelete: (id: number) => void
  onBack: () => void
}

export function EntryDetail({ entry, onEdit, onDelete, onBack }: EntryDetailProps) {
  const moodMeta = MOOD_METADATA[entry.mood] || MOOD_METADATA.Neutral
  
  // Calculate statistics
  const wordCount = React.useMemo(() => 
    entry.content.split(/\s+/).filter(Boolean).length, 
    [entry.content]
  )
  
  const charCount = React.useMemo(() => 
    entry.content.length, 
    [entry.content]
  )
  
  const timeSince = React.useMemo(() => 
    timeAgo(entry.createdAt), 
    [entry.createdAt]
  )
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      onDelete(entry.id)
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
        
        <div>
          <CardTitle className="text-2xl md:text-3xl mb-2">
            {entry.title || "(Untitled Entry)"}
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className={`px-2 py-1 rounded-full flex items-center gap-1.5 ${moodMeta.color}`}>
              <span>{moodMeta.icon}</span>
              <span className="font-medium">{entry.mood}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeSince}</span>
            </div>
          </div>
        </div>
        
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {entry.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {entry.content.split('\n').map((paragraph, i) => (
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </div>
      </CardContent>
      
      <Separator className="" orientation="horizontal" decorative={true} />
      
      <CardFooter className="flex justify-between py-4 text-xs text-muted-foreground">
        <div>
          Word Count: {wordCount} | Character Count: {charCount}
        </div>
        <div>
          Last Edited: {formatDate(entry.lastEdited)}
        </div>
      </CardFooter>
    </Card>
  )
}
