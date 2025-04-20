import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Pencil } from 'lucide-react';

type Mood = 'Happy' | 'Sad' | 'Anxious' | 'Productive' | 'Neutral';

interface QuickEntryButtonProps {
  onSave: (entry: {
    title: string;
    content: string;
    mood: Mood;
    tags: string[];
  }) => void;
  isLoading?: boolean;
}

export function QuickEntryButton({ onSave, isLoading = false }: QuickEntryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('Neutral');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags
    });

    // Reset form and close
    setTitle('');
    setContent('');
    setMood('Neutral');
    setTags([]);
    setIsOpen(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const moodIcons = {
    'Happy': '😊',
    'Sad': '😔',
    'Anxious': '😰',
    'Productive': '💪',
    'Neutral': '😐'
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Quick Journal Entry</span>
        </Button>
      </motion.div>

      {/* Quick Entry Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-lg mx-auto max-h-[90vh] overflow-auto">
                <motion.div
                  className="w-full"
                  initial={{ y: 50, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
              <Card className="rounded-lg border-border/60 shadow-lg overflow-hidden">
                <CardHeader className="pb-3 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-primary" />
                    Quick Journal Entry
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4 pb-6">
                    <div>
                      <Input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-0 border-b rounded-none px-0 h-auto text-lg font-medium focus-visible:ring-0 focus-visible:border-primary"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[100px] resize-none border-0 focus-visible:ring-0 bg-muted/30 placeholder:text-muted-foreground/60"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium">Mood:</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(moodIcons).map(([moodName, icon]) => (
                          <Button
                            key={moodName}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`p-2 h-auto ${mood === moodName ? 'bg-primary/10 border-primary' : ''}`}
                            onClick={() => setMood(moodName as Mood)}
                            disabled={isLoading}
                          >
                            <span className="mr-1">{icon}</span>
                            {moodName}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        type="text"
                        placeholder="Add tags (press Enter after each)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="text-sm mb-5"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end border-t pt-4 pb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="default"
                      onClick={() => setIsOpen(false)}
                      className="mr-2"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="default"
                      size="default"
                      className=""
                      disabled={!title.trim() || !content.trim() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="mr-2">Saving</span>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        'Save Entry'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
