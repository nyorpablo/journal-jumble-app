"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MoodChart } from "@/components/journal/MoodChart"
import { Calendar, Clock, Hash, FileText } from "lucide-react"

// Implement utility functions directly to avoid import issues

// Calculate mood statistics from entries
function calculateMoodStats(entries: any[]) {
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return {
      moodCounts: {},
      topMood: null,
      totalEntries: 0
    }
  }
  
  // Count occurrences of each mood
  const moodCounts: Record<string, number> = {}
  entries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    }
  })
  
  // Find the most common mood
  let topMood = null
  let maxCount = 0
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count
      topMood = mood
    }
  })
  
  return {
    moodCounts,
    topMood,
    totalEntries: entries.length
  }
}

interface StatsDisplayProps {
  entries: any[]
  className?: string
}

export function StatsDisplay({ entries, className = "" }: StatsDisplayProps) {
  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = entries.length
    
    // Get all unique tags
    const allTags = new Set<string>()
    entries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag: string) => allTags.add(tag))
      }
    })
    
    // Calculate total word count
    const totalWords = entries.reduce((sum, entry) => {
      const wordCount = entry.content ? entry.content.split(/\s+/).filter(Boolean).length : 0
      return sum + wordCount
    }, 0)
    
    // Get most recent entry date
    const mostRecentDate = entries.length > 0 
      ? new Date(Math.max(...entries.map(e => new Date(e.createdAt).getTime())))
      : null
      
    // Calculate mood statistics
    const moodStatsData = calculateMoodStats(entries)
    
    // Transform mood counts into the array format expected by MoodChart
    const moodStats = Object.entries(moodStatsData.moodCounts).map(([mood, count]) => ({
      mood: mood as 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral',
      count,
      percentage: (count / moodStatsData.totalEntries) * 100
    }))
    
    return { 
      total, 
      uniqueTags: allTags.size,
      totalWords,
      mostRecentDate,
      moodStats
    }
  }, [entries])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Entry Count Card */}
      <Card className="">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <FileText className="h-5 w-5 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Entries</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Hash className="h-5 w-5 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.uniqueTags}</div>
              <div className="text-xs text-muted-foreground">Unique Tags</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <div className="text-2xl font-bold">{stats.totalWords}</div>
              <div className="text-xs text-muted-foreground">Total Words</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mb-1" />
              <div className="text-sm font-medium">
                {stats.mostRecentDate 
                  ? stats.mostRecentDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  : "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">Last Entry</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mood Chart */}
      {stats.moodStats && stats.moodStats.length > 0 && (
        <MoodChart moodData={stats.moodStats} />
      )}
      
      {/* Empty state */}
      {entries.length === 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No entries yet. Create your first journal entry to see statistics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
