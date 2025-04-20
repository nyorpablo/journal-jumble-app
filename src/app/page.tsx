'use client';

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner, LoadingCard, ButtonSpinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { WelcomeBanner } from "@/components/ui/welcome-banner";
import { QuickEntryButton } from "@/components/ui/quick-entry-button";
import { LazyContent } from "@/components/ui/lazy-content";
import { Pagination } from "@/components/ui/pagination";

// Import icons
import { AlertCircle, Check, Info, X, Loader2, BookOpen, Search, SlidersHorizontal, Tag, Calendar, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

// --- Type Definitions ---
// Define the structure of a Journal Entry
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: Mood; // Use specific Mood type
  tags: string[];
  createdAt: string; // ISO date string
  lastEdited: string; // ISO date string
}

// Define Mood type if stricter checking is desired
type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral';

// --- Constants ---
const LOCAL_STORAGE_KEY = 'journalEntriesShadcnV2';
// Use the Mood type for MOODS array
const MOODS: Mood[] = ['Happy', 'Sad', 'Anxious', 'Productive', 'Neutral'];
const PREVIEW_LENGTH = 90; // Slightly shorter preview

// --- Helper Functions ---
// Add type annotations to helpers
const parseTags = (tagString: string): string[] => {
    if (!tagString) return [];
    return tagString.split(',').map(tag => tag.trim()).filter(Boolean);
};

const formatTags = (tagsArray: string[] | undefined): string => {
    return (tagsArray || []).join(', ');
};

const createPreview = (text: string): string => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > PREVIEW_LENGTH ? plainText.substring(0, PREVIEW_LENGTH) + '…' : plainText;
};

// --- Reusable Components ---
/**
 * Component for the entry creation/editing form.
 * Uses shadcn/ui components for inputs, labels, buttons, etc.
 */
interface EntryFormProps {
  entry?: JournalEntry | null;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EntryForm: React.FC<EntryFormProps> = ({ entry, onSubmit, onCancel, isSubmitting = false }) => {
  const [title, setTitle] = useState(entry ? entry.title : '');
  const [content, setContent] = useState(entry ? entry.content : '');
  const [mood, setMood] = useState<Mood>(entry ? entry.mood : 'Neutral');
  const [tagsString, setTagsString] = useState(entry ? formatTags(entry.tags) : '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(entry ? entry.tags : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!entry;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    // If there are validation errors, show them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Submit the form
    const tags = parseTags(tagsString);
    onSubmit({ title, content, mood, tags });
  };

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="">{isEditing ? 'Edit Entry' : 'Create New Entry'}</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="editor-title" className={errors.title ? 'text-destructive' : ''}>Title</Label>
            <Input 
              className={errors.title ? 'border-destructive focus:ring-destructive' : ''} 
              type="text" 
              id="editor-title" 
              value={title} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }} 
              placeholder="Entry Title" 
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="editor-content" className={errors.content ? 'text-destructive' : ''}>Content</Label>
            <Textarea 
              className={errors.content ? 'border-destructive focus:ring-destructive' : ''} 
              id="editor-content" 
              value={content} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors(prev => ({ ...prev, content: '' }));
                }
              }} 
              placeholder="Your thoughts..." 
              rows={10}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="editor-tags" className="font-medium">Tags</Label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring focus-within:border-input">
                {tags.map(tag => (
                  <div key={tag} className="animate-fade-in">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1 px-2 py-1 bg-secondary/80 text-secondary-foreground"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => {
                          const newTags = tags.filter(t => t !== tag);
                          setTags(newTags);
                          setTagsString(newTags.join(', '));
                        }}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                        disabled={isSubmitting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    </Badge>
                  </div>
                ))}
                
                <input
                  type="text"
                  id="editor-tags"
                  className="flex-1 min-w-[120px] border-0 p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
                  placeholder={tags.length === 0 ? "Add tags (press Enter after each tag)" : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      const newTag = tagInput.trim();
                      if (!tags.includes(newTag)) {
                        const newTags = [...tags, newTag];
                        setTags(newTags);
                        setTagsString(newTags.join(', '));
                      }
                      setTagInput('');
                    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
                      const newTags = tags.slice(0, -1);
                      setTags(newTags);
                      setTagsString(newTags.join(', '));
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Press Enter to add a tag, Backspace to remove the last tag
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="font-medium">Mood</Label>
            <div className="pt-1">
              <div className="grid grid-cols-5 gap-3 sm:flex sm:flex-wrap sm:gap-4">
                {MOODS.map(m => {
                  const moodIcons = {
                    'Happy': '😊',
                    'Sad': '😔',
                    'Anxious': '😰',
                    'Productive': '💪',
                    'Neutral': '😐'
                  };
                  const isSelected = mood === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m as Mood)}
                      disabled={isSubmitting}
                      className={`
                        relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200
                        ${isSelected 
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50 hover:bg-muted'}
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span className="text-3xl mb-2">{moodIcons[m as keyof typeof moodIcons]}</span>
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {m}
                      </span>
                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-end space-x-3 p-0 pt-4">
            <Button 
              className="" 
              size="default" 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="" 
              variant="default" 
              size="default" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  {isEditing ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Add Entry'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Component to display the full details of a selected entry.
 * Uses shadcn/ui Card and Badge components.
 */
interface EntryDetailProps {
    entry: JournalEntry;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    isDeleting?: boolean;
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onEdit, onDelete, onBack, isDeleting = false }) => {
  // Define hooks at the top level, before any conditional returns
  const timeSince = useMemo(() => {
    if (!entry) return '';
    const now = new Date();
    const created = new Date(entry.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }, [entry]);
  
  const wordCount = useMemo(() => entry ? entry.content.split(/\s+/).filter(Boolean).length : 0, [entry]);
  const charCount = useMemo(() => entry ? entry.content.length : 0, [entry]);
  const readingTime = useMemo(() => {
    const avgWordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / avgWordsPerMinute);
    return minutes <= 1 ? '1 min read' : `${minutes} min read`;
  }, [wordCount]);

  // Conditional check after hooks
  if (!entry) return null;

  // Format dates for better readability
  const createdDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const lastEditedDate = new Date(entry.lastEdited).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const lastEditedTime = new Date(entry.lastEdited).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="border-0 shadow-none">
      {/* Header with navigation and actions */}
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center mb-6">
          <Button 
            className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors" 
            variant="link" 
            size="default" 
            onClick={onBack}
            disabled={isDeleting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to entries
          </Button>
          <div className="flex space-x-2">
            <Button 
              className="shadow-sm hover:shadow transition-all" 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(entry)}
              disabled={isDeleting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
            <Button 
              className="shadow-sm hover:shadow transition-all" 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(entry.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <ButtonSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Title and metadata */}
        <div className="space-y-4">
          <CardTitle className="text-2xl md:text-3xl font-bold">{entry.title || "(Untitled)"}</CardTitle>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Mood badge */}
            <Badge 
              className={`px-2 py-0.5 ${MOOD_COLORS[entry.mood]}`} 
              variant="outline"
            >
              {MOOD_ICONS[entry.mood]} {entry.mood}
            </Badge>
            
            {/* Date info */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span title={createdDate}>{timeSince}</span>
            </div>
            
            {/* Reading time */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{readingTime}</span>
            </div>
          </div>
          
          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {entry.tags.map((tag: string) => (
                <Badge 
                  className="px-2 py-0.5 bg-muted hover:bg-muted/80 transition-colors" 
                  key={tag} 
                  variant="outline"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="pt-8">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {entry.content.split('\n').map((paragraph, i) => (
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </div>
      </CardContent>
      
      <Separator className="my-6" />
      
      {/* Footer with stats */}
      <CardFooter className="flex justify-between py-4 text-xs text-muted-foreground">
        <div>
          <span className="inline-flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            {wordCount} words
          </span>
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {charCount} characters
          </span>
        </div>
        <div className="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Last edited: {lastEditedDate} at {lastEditedTime}
        </div>
      </CardFooter>
    </Card>
  );
};

/**
 * Component representing a single item in the journal entry list.
 * Displays title, preview, metadata, and action buttons.
 */
interface EntryListItemProps {
    entry: JournalEntry;
    onSelect: (entry: JournalEntry) => void;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: number) => void;
}

// Define mood icons and colors for visual representation
const MOOD_ICONS: Record<Mood, string> = {
  'Happy': '😊',
  'Sad': '😔',
  'Anxious': '😰',
  'Productive': '💪',
  'Neutral': '😐'
};

// Legacy mood colors for backward compatibility
const MOOD_COLORS: Record<Mood, string> = {
  'Happy': 'bg-opacity-15 text-opacity-90 border-opacity-20 bg-mood-happy border-mood-happy text-white',
  'Sad': 'bg-opacity-15 text-opacity-90 border-opacity-20 bg-mood-sad border-mood-sad text-white',
  'Anxious': 'bg-opacity-15 text-opacity-90 border-opacity-20 bg-mood-anxious border-mood-anxious text-white',
  'Productive': 'bg-opacity-15 text-opacity-90 border-opacity-20 bg-mood-productive border-mood-productive text-white',
  'Neutral': 'bg-opacity-15 text-opacity-90 border-opacity-20 bg-mood-neutral border-mood-neutral text-black'
};

// Map mood to badge variant
const getMoodVariant = (mood: string): 'happy' | 'sad' | 'anxious' | 'productive' | 'neutral' => {
  switch(mood.toLowerCase()) {
    case 'happy': return 'happy';
    case 'sad': return 'sad';
    case 'anxious': return 'anxious';
    case 'productive': return 'productive';
    default: return 'neutral';
  }
};

const EntryListItem: React.FC<EntryListItemProps> = ({ entry, onSelect, onEdit, onDelete }) => {
  // Format the date in a more readable way
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Calculate time since creation
  const timeAgo = (() => {
    const now = new Date();
    const created = new Date(entry.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formattedDate;
  })();
  
  return (
    <li className="group border-b last:border-b-0 hover:bg-muted/40 transition-all duration-200 px-4 py-5">
      <div 
        onClick={() => onSelect(entry)} 
        className="cursor-pointer grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-start"
      >
        {/* Mood Icon */}
        <div className={`hidden md:flex h-10 w-10 rounded-full items-center justify-center ${MOOD_COLORS[entry.mood]} shadow-sm border`}>
          <span className="text-lg" role="img" aria-label={`Mood: ${entry.mood}`}>
            {MOOD_ICONS[entry.mood]}
          </span>
        </div>
        
        {/* Entry Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {entry.title || '(Untitled Entry)'}
            </h3>
            <Badge 
              className="md:hidden px-1.5 py-0"
              variant={getMoodVariant(entry.mood)}
            >
              {MOOD_ICONS[entry.mood]} {entry.mood}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{createPreview(entry.content)}</p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span title={formattedDate}>{timeAgo}</span>
            </div>
            
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div className="flex items-center gap-1 flex-wrap">
                  {entry.tags.slice(0, 3).map((tag: string) => (
                    <Badge 
                      className="px-1.5 py-0 font-normal bg-muted hover:bg-muted/70" 
                      key={tag} 
                      variant="outline"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 3 && (
                    <Badge variant="outline" className="px-1.5 py-0 font-normal bg-muted hover:bg-muted/70">
                      +{entry.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex md:flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10" 
            variant="ghost" 
            size="sm" 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(entry); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="sr-only md:not-sr-only md:ml-1.5">Edit</span>
          </Button>
          <Button 
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" 
            variant="ghost" 
            size="sm" 
            onClick={(e: React.MouseEvent) => { 
              e.stopPropagation(); 
              onDelete(entry.id); 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="sr-only md:not-sr-only md:ml-1.5">Delete</span>
          </Button>
        </div>
      </div>
    </li>
  );
};

/**
 * Component containing filter and sort controls for the entry list.
 * Uses shadcn/ui Input, Select components.
 */
interface ControlBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterMood: string;
    setFilterMood: (value: string) => void;
    filterTag: string;
    setFilterTag: (value: string) => void;
    sortKey: string;
    setSortKey: (value: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

const ControlBar: React.FC<ControlBarProps> = ({ searchTerm, setSearchTerm, filterMood, setFilterMood, filterTag, setFilterTag, sortKey, setSortKey, sortOrder, setSortOrder }) => (
  <div className="grid gap-4">
    <div className="grid gap-1.5">
      <Label htmlFor="search-input" className="text-xs font-medium">Search Term</Label>
      <Input className="" type="text" id="search-input" placeholder="Search..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="tag-filter-input" className="text-xs font-medium">Filter by Tag</Label>
      <Input className="" type="text" id="tag-filter-input" placeholder="Enter tag..." value={filterTag} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterTag(e.target.value)} />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="filter-mood" className="text-xs font-medium">Filter by Mood</Label>
       <Select value={filterMood} onValueChange={setFilterMood}>
        <SelectTrigger id="filter-mood" className=""><SelectValue placeholder="Select Mood" /></SelectTrigger>
        <SelectContent className="">
          <SelectItem className="" value="All">All Moods</SelectItem>
          {MOODS.map(m => <SelectItem className="" key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">Sort By</Label>
      <div className="flex flex-col space-y-2">
        <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Sort Key" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
            </SelectContent>
        </Select>
        
        <Button 
          className="w-full justify-between bg-muted/50 hover:bg-muted transition-colors h-9" 
          variant="outline"
          size="default"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span>Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </span>
          {sortOrder === 'asc' 
            ? <ArrowUp className="h-4 w-4 text-primary" /> 
            : <ArrowDown className="h-4 w-4 text-primary" />}
        </Button>
      </div>
    </div>
  </div>
);

/**
 * Component displaying overall statistics about the journal entries.
 * Uses shadcn/ui Badge and Separator.
 */
interface StatsDisplayProps {
    entries: JournalEntry[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const total = entries.length;
    // Ensure moodCounts keys match Mood type
    const moodCounts = MOODS.reduce((acc, mood) => ({ ...acc, [mood]: 0 }), {} as Record<Mood, number>);
    entries.forEach(entry => {
      // Type guard for mood
      const moodKey = entry.mood as Mood;
      if (moodKey && moodCounts.hasOwnProperty(moodKey)) {
          moodCounts[moodKey]++;
      }
    });
    return { total, moodCounts };
  }, [entries]);

  // Only show moods with counts > 0 for less clutter
  const activeMoods = MOODS.filter(mood => stats.moodCounts[mood] > 0);

  return (
    <div className="space-y-4">
        <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Entries</p>
            <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <Separator className="" />
        {activeMoods.length > 0 && (
             <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mood Breakdown:</p>
                <div className="flex flex-wrap gap-2">
                   {activeMoods.map(mood => (
                       <Badge className="" key={mood} variant="secondary">{mood}: {stats.moodCounts[mood]}</Badge>
                   ))}
                </div>
            </div>
        )}
    </div>
  );
};

// --- Main Page Component ---
/**
 * This is the primary component that orchestrates the entire Journal Dashboard application.
 * It manages the main application state, handles data fetching/saving, 
 * manages view transitions, and renders the overall layout and child components.
 */
export default function JournalPage() {
  // Core data state
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'view' | 'edit' | 'create'>('list');
  
  // Loading and operation states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  
  // Confirmation dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  
  // Welcome banner state
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMood, setFilterMood] = useState<string>('All');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  
  // Toast notification
  const { toast } = useToast();

  // --- Data Loading & Saving ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setOperationError(null);
      let loadedEntries: JournalEntry[] = [];
      
      try {
        if (typeof window !== 'undefined') {
          // Simulate network delay for demo purposes (remove in production)
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const storedEntries = window.localStorage.getItem(LOCAL_STORAGE_KEY);
          loadedEntries = storedEntries ? JSON.parse(storedEntries) as JournalEntry[] : [];
          
          // Data validation and normalization
          loadedEntries.forEach(entry => {
            if (!Array.isArray(entry.tags)) entry.tags = [];
            if (!entry.mood || !MOODS.includes(entry.mood as Mood)) {
              entry.mood = 'Neutral'; // Ensure mood is valid or default
            }
          });
          
          setAllEntries(loadedEntries);
          
          // Check if this is a first-time user
          const hasSeenWelcome = window.localStorage.getItem('journalDashboardWelcomeSeen');
          if (!hasSeenWelcome && loadedEntries.length === 0) {
            setShowWelcomeBanner(true);
          }
          
          if (loadedEntries.length > 0) {
            toast({
              title: "Journal loaded",
              description: `${loadedEntries.length} entries found`,
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load journal entries:", error);
        setOperationError("Failed to load your journal entries. Please refresh the page.");
        setAllEntries([]);
        
        toast({
          title: "Error loading journal",
          description: "There was a problem loading your entries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    const saveData = async () => {
      if (!isLoading && typeof window !== 'undefined' && allEntries) {
        setIsSaving(true);
        try {
          // Simulate network delay for demo purposes (remove in production)
          await new Promise(resolve => setTimeout(resolve, 300));
          
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allEntries));
        } catch (error) {
          console.error("Failed to save journal entries:", error);
          toast({
            title: "Save error",
            description: "Failed to save your changes",
            variant: "destructive",
          });
        } finally {
          setIsSaving(false);
        }
      }
    };
    
    saveData();
  }, [allEntries, isLoading, toast]);

  // --- CRUD Handlers ---
  const handleAddEntry = useCallback(async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => {
    setIsSaving(true);
    try {
      // Simulate network delay for demo purposes (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEntry: JournalEntry = { 
        id: Date.now(), 
        createdAt: new Date().toISOString(), 
        lastEdited: new Date().toISOString(), 
        ...entryData 
      };
      
      setAllEntries(prev => [newEntry, ...prev]);
      setCurrentView('list');
      
      toast({
        title: "Entry created",
        description: "Your journal entry was successfully created",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to create entry:", error);
      toast({
        title: "Error creating entry",
        description: "There was a problem creating your entry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const handleUpdateEntry = useCallback(async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'lastEdited'>) => {
    setIsSaving(true);
    try {
      // Simulate network delay for demo purposes (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAllEntries(prev => prev.map(e => 
        e.id === selectedEntryId 
          ? { ...e, ...entryData, lastEdited: new Date().toISOString() } 
          : e
      ));
      
      setCurrentView('view');
      
      toast({
        title: "Entry updated",
        description: "Your journal entry was successfully updated",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to update entry:", error);
      toast({
        title: "Error updating entry",
        description: "There was a problem updating your entry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedEntryId, toast]);

  // Initiates the delete confirmation process
  const initiateDeleteEntry = useCallback((idToDelete: number) => {
    setEntryToDelete(idToDelete);
    setDeleteConfirmOpen(true);
  }, []);
  
  // Actually performs the deletion after confirmation
  const handleDeleteEntry = useCallback(async () => {
    if (entryToDelete === null) return;
    
    setIsSaving(true);
    try {
      // Simulate network delay for demo purposes (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAllEntries(prev => prev.filter(e => e.id !== entryToDelete));
      
      if (selectedEntryId === entryToDelete) {
        setSelectedEntryId(null);
        setCurrentView('list');
      }
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry was successfully deleted",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast({
        title: "Error deleting entry",
        description: "There was a problem deleting your entry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setDeleteConfirmOpen(false);
      setEntryToDelete(null);
    }
  }, [entryToDelete, selectedEntryId, toast]);

  // --- View Navigation Handlers ---
  const openCreateView = () => { setCurrentView('create'); setSelectedEntryId(null); };
  const openEditView = (entry: JournalEntry) => { setCurrentView('edit'); setSelectedEntryId(entry.id); };
  const openDetailView = (entry: JournalEntry) => { setCurrentView('view'); setSelectedEntryId(entry.id); };
  const goBackToList = () => { setCurrentView('list'); setSelectedEntryId(null); };

  // --- Filtering and Sorting Logic (Memoized) ---
  const processedEntries = useMemo((): JournalEntry[] => {
    let r: JournalEntry[] = [...allEntries];
    if (filterMood !== 'All') r = r.filter(e => e.mood === filterMood);
    if (filterTag) { const lT=filterTag.toLowerCase(); r = r.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes(lT))); }
    if (searchTerm) { const lS=searchTerm.toLowerCase(); r = r.filter(e => (e.title&&e.title.toLowerCase().includes(lS))||(e.content&&e.content.toLowerCase().includes(lS))); }
    r.sort((a, b) => {
      let valA: any, valB: any; // Use 'any' for simplicity here, or type based on sortKey
      switch (sortKey) {
          case 'title': valA = a.title.toLowerCase(); valB = b.title.toLowerCase(); break;
          case 'mood': valA = a.mood.toLowerCase(); valB = b.mood.toLowerCase(); break;
          default: valA = new Date(a.createdAt); valB = new Date(b.createdAt); break;
      }
      // Use getTime() for date comparison
      const comp = sortKey === 'createdAt' ? valA.getTime() - valB.getTime() : (valA < valB ? -1 : (valA > valB ? 1 : 0));
      return sortOrder === 'desc' ? (comp * -1) : comp;
    });
    return r;
  }, [allEntries, searchTerm, filterMood, filterTag, sortKey, sortOrder]);
  
  // Pagination logic
  const totalPages = Math.ceil(processedEntries.length / entriesPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMood, filterTag, sortKey, sortOrder]);
  
  // Get current entries for the current page
  const currentEntries = useMemo(() => {
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    return processedEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  }, [processedEntries, currentPage, entriesPerPage]);

  const selectedEntry = useMemo(() => allEntries.find(entry => entry.id === selectedEntryId), [allEntries, selectedEntryId]);

  // --- Dynamic Content Area ---
  const renderMainContent = (): React.ReactElement => {
      // Show error state if there's an operation error
      if (operationError) {
          return (
              <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{operationError}</AlertDescription>
              </Alert>
          );
      }
      
      // Show loading state
      if (isLoading) {
          return <LoadingCard message="Loading your journal entries..." />;
      }
      
      // Show saving indicator when performing operations
      const SavingIndicator = isSaving ? (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-md flex items-center space-x-2 z-50">
              <Spinner size="sm" />
              <span>Saving changes...</span>
          </div>
      ) : null;
      
      switch (currentView) {
          case 'create':
          case 'edit':
              const entryToEdit = currentView === 'edit' ? selectedEntry : null;
              const cancelAction = currentView === 'edit' ? () => setCurrentView('view') : goBackToList;
              return (
                  <>
                      {SavingIndicator}
                      <EntryForm 
                          key={entryToEdit?.id || 'create'} 
                          entry={entryToEdit as JournalEntry | null | undefined} 
                          onSubmit={currentView === 'edit' ? handleUpdateEntry : handleAddEntry} 
                          onCancel={cancelAction} 
                          isSubmitting={isSaving}
                      />
                  </>
              );
              
          case 'view':
              return selectedEntry ? (
                  <>
                      {SavingIndicator}
                      <EntryDetail 
                          entry={selectedEntry as JournalEntry} 
                          onEdit={openEditView} 
                          onDelete={initiateDeleteEntry} 
                          onBack={goBackToList} 
                          isDeleting={isSaving}
                      />
                  </>
              ) : (
                  <EmptyState
                      title="Entry not found"
                      description="The journal entry you're looking for doesn't exist or has been removed."
                      icon={<AlertCircle className="h-12 w-12" />}
                      action={{ 
                        label: "Back to Journal", 
                        onClick: goBackToList,
                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      }}
                      illustration="search"
                      className="mt-8 p-10 animate-fade-in"
                  />
              );
              
          case 'list':
          default:
              // No entries at all
              if (allEntries.length === 0) {
                  return (
                      <EmptyState
                          title="Your journal is empty"
                          description="Start by creating your first journal entry to track your thoughts and moods. You can use the quick entry button for a faster experience."
                          icon={<BookOpen className="h-12 w-12" />}
                          action={{ 
                            label: "Create First Entry", 
                            onClick: openCreateView,
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          }}
                          secondaryAction={{
                            label: "Learn More",
                            onClick: () => setShowWelcomeBanner(true)
                          }}
                          illustration="journal"
                          className="mt-8 p-10 animate-fade-in"
                      />
                  );
              }
              
              // Has entries but none match the current filters
              if (processedEntries.length === 0) {
                  return (
                      <>
                          {SavingIndicator}
                          <EmptyState
                              title="No matching entries"
                              description="Try adjusting your search or filters to find what you're looking for."
                              icon={<Search className="h-12 w-12" />}
                              action={{ 
                                label: "Clear Filters", 
                                onClick: () => {
                                  setSearchTerm('');
                                  setFilterMood('All');
                                  setFilterTag('');
                                },
                                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              }}
                              secondaryAction={{
                                label: "Create New Entry",
                                onClick: openCreateView
                              }}
                              illustration="filter"
                              className="mt-8 p-10 animate-fade-in"
                          />
                      </>
                  );
              }
              
              // Show entries list
              return (
                  <>
                      {SavingIndicator}
                      <div className="space-y-4">
                          <ul className="divide-y divide-border">
                              {currentEntries.map((entry: JournalEntry) => (
                                  <EntryListItem
                                      key={entry.id}
                                      entry={entry}
                                      onSelect={openDetailView}
                                      onEdit={openEditView}
                                      onDelete={initiateDeleteEntry}
                                  />
                              ))}
                          </ul>
                          
                          {/* Pagination */}
                          {processedEntries.length > 0 && (
                              <div className="pt-4 border-t border-border/40 pb-4">
                                  <Pagination
                                      currentPage={currentPage}
                                      totalPages={totalPages}
                                      onPageChange={setCurrentPage}
                                      className="py-2"
                                  />
                                  <div className="text-xs text-center text-muted-foreground mt-2">
                                      Showing {Math.min(processedEntries.length, (currentPage - 1) * entriesPerPage + 1)}-
                                      {Math.min(processedEntries.length, currentPage * entriesPerPage)} of {processedEntries.length} entries
                                  </div>
                              </div>
                          )}
                      </div>
                  </>
              );
      }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Journal Entry"
        description="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isSaving}
        onConfirm={handleDeleteEntry}
      />
      
      {/* Toast Provider */}
      <Toaster />
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-subtle">
        <div className="container mx-auto px-4 py-3 md:px-6 max-w-7xl flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight font-heading text-foreground flex items-center gap-2">
            <span className="text-primary text-2xl">📓</span> Journal Dashboard
          </h1>
          {currentView !== 'create' && currentView !== 'edit' && (
            <Button 
              className="shadow-subtle transition-all hover:shadow-md hover:bg-primary-hover" 
              variant="default" 
              onClick={openCreateView} 
              size="sm"
              disabled={isLoading || isSaving}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Entry
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-7xl">
        {/* Welcome Banner for new users */}
        {showWelcomeBanner && currentView === 'list' && (
          <div className="mb-8">
            <WelcomeBanner 
              onDismiss={() => {
                setShowWelcomeBanner(false);
                // Save that user has seen the welcome message
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('journalDashboardWelcomeSeen', 'true');
                }
              }} 
            />
          </div>
        )}
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-0 h-auto font-medium hover:text-foreground ${currentView === 'list' ? 'text-foreground pointer-events-none' : ''}`}
            onClick={goBackToList}
            disabled={currentView === 'list'}
          >
            All Entries
          </Button>
          
          {currentView !== 'list' && (
            <>
              <span className="mx-2 text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground">
                {currentView === 'create' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Entry
                  </span>
                )}
                {currentView === 'edit' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Entry
                  </span>
                )}
                {currentView === 'view' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {selectedEntry?.title}
                  </span>
                )}
              </span>
            </>
          )}
        </nav>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Content Area - Wider on desktop */}
          <section className="lg:col-span-8 lg:order-1 order-2">
            <div className="bg-background rounded-lg shadow-sm border border-border/40 overflow-hidden">
              <LazyContent>
                {renderMainContent()}
              </LazyContent>
            </div>
            
            {/* Entries per page selector (only shown in list view) */}
            {currentView === 'list' && processedEntries.length > 5 && (
              <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Entries per page:</span>
                  <Select value={entriesPerPage.toString()} onValueChange={(value) => setEntriesPerPage(Number(value))}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar - Controls and Stats */}
          <aside className="lg:col-span-4 lg:order-2 order-1 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Controls Card */}
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <span className="text-primary text-lg">🔍</span> Filter & Sort
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ControlBar 
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                    filterMood={filterMood} setFilterMood={setFilterMood} 
                    filterTag={filterTag} setFilterTag={setFilterTag} 
                    sortKey={sortKey} setSortKey={setSortKey} 
                    sortOrder={sortOrder} setSortOrder={setSortOrder} 
                  />
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <span className="text-primary text-lg">📊</span> Stats & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <StatsDisplay entries={allEntries} />
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        <footer className="mt-16 pt-6 border-t text-center text-xs text-muted-foreground">
          <p className="mb-1">Journal Dashboard v2.0 - Enhanced UI/UX</p>
          <p>Made with ❤️ for better journaling</p>
        </footer>
      </main>

      {/* Quick Entry Button - New Feature */}
      {currentView === 'list' && (
        <QuickEntryButton 
          onSave={handleAddEntry}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
