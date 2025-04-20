import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';

interface AnimatedEntryCardProps {
  entry: {
    id: string;
    title: string;
    content: string;
    date: string;
    mood: string;
    tags: string[];
  };
  index: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  moodColors: Record<string, string>;
  className?: string;
}

export function AnimatedEntryCard({
  entry,
  index,
  onClick,
  onEdit,
  onDelete,
  moodColors,
  className
}: AnimatedEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMM d, yyyy');
  
  // Map mood to badge variant
  const getMoodVariant = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'happy': return 'happy';
      case 'sad': return 'sad';
      case 'anxious': return 'anxious';
      case 'productive': return 'productive';
      default: return 'neutral';
    }
  };
  
  const moodVariant = getMoodVariant(entry.mood);
  const moodColor = moodColors[entry.mood] || 'bg-muted text-muted-foreground';
  
  // Truncate content if it's too long
  const truncatedContent = entry.content.length > 150 
    ? `${entry.content.substring(0, 150)}...` 
    : entry.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05, // Staggered animation
        ease: [0.25, 0.1, 0.25, 1.0] // Smooth easing
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={cn("", className)}
    >
      <Card 
        className="h-full overflow-hidden border-border/60 bg-card hover:bg-card/95 hover:border-border transition-all duration-200 shadow-subtle hover:shadow-md"
        onClick={onClick}
      >
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1.5">
            <h3 className="font-medium leading-tight line-clamp-1">{entry.title}</h3>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <Badge variant={moodVariant} className="ml-2 shrink-0">
            {entry.mood}
          </Badge>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 text-sm text-muted-foreground">
          <p className="line-clamp-3">{truncatedContent}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-1.5 py-0 h-5 bg-secondary/50"
              >
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0 h-5"
              >
                +{entry.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
