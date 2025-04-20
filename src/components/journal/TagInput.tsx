"use client"

import * as React from "react"
import { Hash, Plus, X, Tag as TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  suggestions?: string[]
  label?: string
  placeholder?: string
  className?: string
  maxTags?: number
  disabled?: boolean
}

export function TagInput({ 
  tags, 
  setTags, 
  suggestions = [], 
  label = "Tags",
  placeholder = "Add a tag...",
  className = "",
  maxTags = 10,
  disabled = false
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [activeSuggestions, setActiveSuggestions] = React.useState<string[]>([])
  const [isFocused, setIsFocused] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  // Filter suggestions based on input value
  React.useEffect(() => {
    if (inputValue.trim()) {
      // First check for exact matches to avoid duplicates
      if (tags.some(tag => tag.toLowerCase() === inputValue.toLowerCase())) {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 2000) // Hide tooltip after 2 seconds
        return
      }
      
      const filtered = suggestions
        .filter(tag => 
          !tags.includes(tag) && 
          tag.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 suggestions
      setActiveSuggestions(filtered)
    } else {
      setActiveSuggestions([])
    }
  }, [inputValue, suggestions, tags])
  
  // Close suggestions on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSuggestions([])
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase() // Normalize to lowercase
    
    // Don't add if it's empty, already exists, or we've reached the max
    if (!trimmedTag) return
    if (tags.some(t => t.toLowerCase() === trimmedTag)) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }
    if (tags.length >= maxTags) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }
    
    // Format tag with first letter capitalized for better appearance
    const formattedTag = trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1)
    setTags([...tags, formattedTag])
    setInputValue("")
    setActiveSuggestions([])
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setActiveSuggestions([])
    }
  }
  
  const getTooltipMessage = () => {
    if (tags.some(tag => tag.toLowerCase() === inputValue.toLowerCase())) {
      return "This tag already exists"
    }
    if (tags.length >= maxTags) {
      return `Maximum ${maxTags} tags allowed`
    }
    return ""
  }

  return (
    <div className={className} ref={containerRef}>
      <Label 
        htmlFor="tag-input" 
        className="text-xs font-medium mb-1.5 flex items-center gap-1.5"
      >
        <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
        <span className="text-muted-foreground ml-auto text-xs">
          {tags.length}/{maxTags}
        </span>
      </Label>
      
      <div 
        className={`
          flex flex-wrap gap-1.5 p-2 bg-background rounded-md border 
          ${disabled ? 'bg-muted cursor-not-allowed' : 'cursor-text'}
          ${isFocused ? 'ring-1 ring-primary border-primary/50' : 'border-input hover:border-primary/30'}
          min-h-10 transition-all duration-200
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className={`
              px-2 py-1 gap-1 text-xs font-normal bg-muted/80 hover:bg-muted 
              transition-colors duration-200 animate-in fade-in-50
            `}
          >
            <span className="text-xs text-muted-foreground mr-0.5">#</span>
            {tag}
            {!disabled && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                className="ml-1 rounded-full hover:bg-background p-0.5 transition-colors"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        
        {!disabled && tags.length < maxTags && (
          <TooltipProvider>
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild>
                <Input
                  ref={inputRef}
                  id="tag-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={tags.length === 0 ? placeholder : ""}
                  disabled={disabled}
                  className="
                    flex-grow border-0 p-0 h-7 min-w-[120px] focus-visible:ring-0 
                    placeholder:text-muted-foreground/70 bg-transparent
                  "
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {getTooltipMessage()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {!disabled && inputValue && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 rounded-full hover:bg-muted"
            onClick={() => addTag(inputValue)}
            aria-label="Add tag"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {/* Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="mt-1.5 p-1.5 flex flex-wrap gap-1.5 bg-background border rounded-md shadow-sm animate-in fade-in-50 slide-in-from-top-2">
          <div className="w-full text-xs text-muted-foreground mb-1 px-1">Suggestions:</div>
          {activeSuggestions.map(suggestion => (
            <Badge 
              key={suggestion}
              variant="outline" 
              className="
                cursor-pointer hover:bg-muted px-2 py-1 text-xs
                transition-colors duration-150 flex items-center gap-1
              "
              onClick={() => {
                addTag(suggestion)
                inputRef.current?.focus()
              }}
            >
              <Plus className="h-3 w-3" />
              <span className="text-xs text-muted-foreground mr-0.5">#</span>
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-1.5">
        Press Enter or comma to add • Backspace to remove last tag
      </p>
    </div>
  )
}
