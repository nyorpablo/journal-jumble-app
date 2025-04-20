"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MoodSelector } from "@/components/journal/MoodSelector"
import { TagInput } from "@/components/journal/TagInput"
import { useToast } from "@/hooks/use-toast"

// Implement utility functions directly to avoid import issues

// Extract unique tags from entries
function extractUniqueTags(entries: any[]) {
  if (!entries || !Array.isArray(entries)) return []
  
  const allTags = entries.flatMap(entry => entry.tags || [])
  return [...new Set(allTags)].sort()
}

interface EntryFormProps {
  entry?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  allEntries?: any[]
}

export function EntryForm({ entry, onSubmit, onCancel, allEntries = [] }: EntryFormProps) {
  const [title, setTitle] = React.useState(entry ? entry.title : '')
  const [content, setContent] = React.useState(entry ? entry.content : '')
  const [mood, setMood] = React.useState(entry ? entry.mood : 'Neutral')
  const [tags, setTags] = React.useState<string[]>(entry && entry.tags ? [...entry.tags] : [])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()
  
  const isEditing = !!entry
  const allTags = React.useMemo(() => extractUniqueTags(allEntries), [allEntries])
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your journal entry",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      onSubmit({ title, content, mood, tags })
      toast({
        title: isEditing ? "Entry updated" : "Entry created",
        description: isEditing 
          ? "Your journal entry has been updated successfully" 
          : "Your new journal entry has been created",
      })
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="">
        <CardTitle className="">{isEditing ? 'Edit Entry' : 'Create New Entry'}</CardTitle>
        <CardDescription className="">
          {isEditing 
            ? "Update your journal entry details below" 
            : "Fill in the details for your new journal entry"}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <form id="entry-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                id="title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
                aria-label="Journal entry title"
                required
                type="text"
              />
            </div>
            
            <div>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-y"
                aria-label="Entry content"
              />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <MoodSelector 
                value={mood} 
                onChange={setMood} 
              />
              
              <TagInput 
                tags={tags} 
                setTags={setTags} 
                suggestions={allTags}
                placeholder="Add tags (press Enter)"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
        <Button
          variant="outline"
          size="default"
          className=""
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <span className="">Cancel</span>
        </Button>
        <Button 
          type="submit" 
          form="entry-form"
          disabled={isSubmitting}
          variant="default"
          size="default"
          className=""
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">{isEditing ? 'Saving...' : 'Creating...'}</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Entry'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
