"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define mood colors for visualization
const MOOD_COLORS = {
  'Happy': '#fef9c3', // yellow-100
  'Sad': '#dbeafe', // blue-100
  'Anxious': '#f3e8ff', // purple-100
  'Productive': '#dcfce7', // green-100
  'Neutral': '#f3f4f6', // gray-100
}

type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral';

interface MoodData {
  mood: Mood
  count: number
  percentage: number
}

interface MoodChartProps {
  moodData: MoodData[]
  className?: string
}

export function MoodChart({ moodData, className }: MoodChartProps) {
  // Sort by count descending
  const sortedData = [...moodData].sort((a, b) => b.count - a.count)
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Mood Distribution</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-4">
          {/* Horizontal bar chart */}
          <div className="space-y-2">
            {sortedData.map((item) => (
              <div key={item.mood} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS[item.mood] }}></span>
                    <span>{item.mood}</span>
                  </div>
                  <span className="text-muted-foreground">{item.count} ({Math.round(item.percentage)}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: MOOD_COLORS[item.mood],
                      minWidth: '4px' // Ensure very small percentages are still visible
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Mood legend as color blocks */}
          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            {Object.entries(MOOD_COLORS).map(([mood, color]) => (
              <div key={mood} className="flex items-center gap-1.5">
                <span 
                  className="inline-block w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground">{mood}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
