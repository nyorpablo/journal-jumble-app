import React, { useState, useRef, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InteractiveTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

export function InteractiveTagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  className,
  suggestions = []
}: InteractiveTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions
    .filter(suggestion => 
      !value.includes(suggestion) && 
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring focus-within:border-input">
        <AnimatePresence>
          {value.map(tag => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground"
              >
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="flex-1 min-w-[120px]">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="border-0 p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/70"
          />
        </div>
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md"
        >
          <ul className="py-1">
            {filteredSuggestions.map(suggestion => (
              <li 
                key={suggestion}
                className="px-3 py-1.5 text-sm hover:bg-accent cursor-pointer flex items-center gap-2"
                onClick={() => handleAddTag(suggestion)}
              >
                <Plus className="h-3 w-3 text-muted-foreground" />
                {suggestion}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      <div className="mt-1.5 text-xs text-muted-foreground">
        Press Enter to add a tag, Backspace to remove the last tag
      </div>
    </div>
  );
}
