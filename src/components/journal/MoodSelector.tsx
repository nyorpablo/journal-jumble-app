"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InteractiveMoodSelector } from "@/components/ui/interactive-mood-selector"

// Define mood colors and icons with descriptions
const MOOD_METADATA = {
  'Happy': { 
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700', 
    hoverColor: 'hover:bg-yellow-200',
    selectedColor: 'bg-yellow-200 border-yellow-400 shadow-sm',
    icon: '😊',
    description: 'Feeling joyful, content, or pleased'
  },
  'Sad': { 
    color: 'bg-blue-100 border-blue-300 text-blue-700', 
    hoverColor: 'hover:bg-blue-200',
    selectedColor: 'bg-blue-200 border-blue-400 shadow-sm',
    icon: '😔',
    description: 'Feeling down, unhappy, or low'
  },
  'Anxious': { 
    color: 'bg-purple-100 border-purple-300 text-purple-700', 
    hoverColor: 'hover:bg-purple-200',
    selectedColor: 'bg-purple-200 border-purple-400 shadow-sm',
    icon: '😰',
    description: 'Feeling worried, nervous, or uneasy'
  },
  'Productive': { 
    color: 'bg-green-100 border-green-300 text-green-700', 
    hoverColor: 'hover:bg-green-200',
    selectedColor: 'bg-green-200 border-green-400 shadow-sm',
    icon: '💪',
    description: 'Feeling efficient, accomplished, or effective'
  },
  'Neutral': { 
    color: 'bg-gray-100 border-gray-300 text-gray-700', 
    hoverColor: 'hover:bg-gray-200',
    selectedColor: 'bg-gray-200 border-gray-400 shadow-sm',
    icon: '😐',
    description: 'Feeling balanced, calm, or indifferent'
  }
}

type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral';

interface MoodSelectorProps {
  value: Mood
  onChange: (value: Mood) => void
  moods?: Mood[]
  label?: string
  className?: string
  disabled?: boolean
  showDescriptions?: boolean
}

export function MoodSelector({ 
  value, 
  onChange, 
  moods = ['Happy', 'Sad', 'Anxious', 'Productive', 'Neutral'],
  label = "Mood",
  className,
  disabled = false,
  showDescriptions = true
}: MoodSelectorProps) {
  // Track which mood is being hovered for keyboard navigation
  const [focusedMood, setFocusedMood] = React.useState<Mood | null>(null)
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, mood: Mood) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(mood)
    }
  }
  
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium flex items-center gap-1.5">
          <span className="text-base">{MOOD_METADATA[value].icon}</span>
          {label}
        </Label>
        {showDescriptions && (
          <span className="text-xs text-muted-foreground">
            {MOOD_METADATA[value].description}
          </span>
        )}
      </div>
      
      <RadioGroup 
        value={value} 
        onValueChange={(val) => !disabled && onChange(val as Mood)} 
        className="flex flex-wrap gap-2"
      >
        <TooltipProvider>
          {moods.map(mood => {
            const meta = MOOD_METADATA[mood];
            return (
              <Tooltip key={mood}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "relative transition-all duration-200",
                      disabled && "opacity-70"
                    )}
                    onMouseEnter={() => setFocusedMood(mood)}
                    onMouseLeave={() => setFocusedMood(null)}
                  >
                    <RadioGroupItem 
                      value={mood} 
                      id={`mood-${mood}`} 
                      className="sr-only"
                      disabled={disabled}
                    />
                    <Label 
                      htmlFor={`mood-${mood}`} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all",
                        meta.hoverColor,
                        disabled ? "cursor-not-allowed opacity-70" : "hover:shadow-sm",
                        value === mood 
                          ? cn(meta.selectedColor, "border-2 scale-105") 
                          : "bg-background border-muted-foreground/20",
                        focusedMood === mood && value !== mood && "border-primary/40 ring-1 ring-primary/30"
                      )}
                      tabIndex={disabled ? -1 : 0}
                      onKeyDown={(e) => handleKeyDown(e, mood)}
                    >
                      <span className="text-xl">{meta.icon}</span>
                      <span className="text-sm font-medium">{mood}</span>
                      
                      {/* Visual indicator for selected mood */}
                      {value === mood && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-in fade-in-50 zoom-in-50"></span>
                      )}
                    </Label>
                  </div>
                </TooltipTrigger>
                {showDescriptions && (
                  // @ts-ignore - shadcn/ui component type definition issue
                  <TooltipContent side="bottom" className="text-xs p-2" children={meta.description} />
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </RadioGroup>
    </div>
  )
}
