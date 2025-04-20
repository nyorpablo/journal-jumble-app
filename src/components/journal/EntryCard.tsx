"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Eye } from "lucide-react"
import { AnimatedEntryCard } from "@/components/ui/animated-entry-card"
import { format, formatDistanceToNow as distanceToNow } from "date-fns"

// Format date to readable string
function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}

// Get time ago string from date
function timeAgo(dateString: string) {
  return distanceToNow(new Date(dateString), { addSuffix: true })
}

// Highlight text with search term
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

// Define mood colors with new design tokens
const MOOD_COLORS = {
  'Happy': 'bg-happy-100 text-happy-800 border-happy-200',
  'Sad': 'bg-sad-100 text-sad-800 border-sad-200',
  'Anxious': 'bg-anxious-100 text-anxious-800 border-anxious-200',
  'Productive': 'bg-productive-100 text-productive-800 border-productive-200',
  'Neutral': 'bg-neutral-100 text-neutral-800 border-neutral-200',
}

interface EntryCardProps {
  entry: {
    id: number
    title: string
    content: string
    mood: string
    tags: string[]
    createdAt: string
    lastEdited: string
  }
  onSelect: (entry: any) => void
  onEdit: (entry: any) => void
  onDelete: (id: number) => void
  searchTerm?: string
  className?: string
  index?: number
}

export function EntryCard({ 
  entry, 
  onSelect, 
  onEdit, 
  onDelete, 
  searchTerm = "",
  className = "",
  index = 0
}: EntryCardProps) {
  const { id, title, content, mood, tags, createdAt, lastEdited } = entry
  
  // Determine if the entry matches search term for highlighting
  const matchesSearch = searchTerm && (
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Create a modified entry object that matches the AnimatedEntryCard props
  const cardEntry = {
    id: String(id),
    title: title,
    content: content,
    date: createdAt,
    mood: mood,
    tags: tags
  }

  return (
    <div className={`${matchesSearch ? 'ring-1 ring-primary/20 rounded-lg' : ''} ${className}`}>
      <AnimatedEntryCard
        entry={cardEntry}
        index={index}
        onClick={() => onSelect(entry)}
        onEdit={() => onEdit(entry)}
        onDelete={() => onDelete(id)}
        moodColors={MOOD_COLORS}
        className={matchesSearch ? 'border-primary/30' : ''}
      />
    </div>
  )
}
