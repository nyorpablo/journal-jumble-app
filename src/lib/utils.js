import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date to readable string
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get time ago string from date
export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
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

// Extract unique tags from entries
export function extractUniqueTags(entries) {
  const tagSet = new Set()
  
  entries.forEach(entry => {
    if (entry.tags && Array.isArray(entry.tags)) {
      entry.tags.forEach(tag => {
        if (tag) tagSet.add(tag)
      })
    }
  })
  
  return Array.from(tagSet)
}

// Highlight text with search term
export function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 rounded-sm px-0.5">$1</mark>')
}

// Calculate mood statistics
export function calculateMoodStats(entries) {
  const total = entries.length
  if (total === 0) return []
  
  const moodCounts = {}
  
  // Count occurrences of each mood
  entries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    }
  })
  
  // Convert to array with percentages
  return Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: (count / total) * 100
  }))
}
