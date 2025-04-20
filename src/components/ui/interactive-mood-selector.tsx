import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface InteractiveMoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function InteractiveMoodSelector({ value, onChange, className }: InteractiveMoodSelectorProps) {
  const moods: MoodOption[] = [
    { 
      value: 'Happy', 
      label: 'Happy', 
      icon: '😊', 
      description: 'Feeling joyful, content, or pleased'
    },
    { 
      value: 'Sad', 
      label: 'Sad', 
      icon: '😔', 
      description: 'Feeling down, blue, or unhappy'
    },
    { 
      value: 'Anxious', 
      label: 'Anxious', 
      icon: '😰', 
      description: 'Feeling worried, nervous, or uneasy'
    },
    { 
      value: 'Productive', 
      label: 'Productive', 
      icon: '💪', 
      description: 'Feeling accomplished, efficient, or effective'
    },
    { 
      value: 'Neutral', 
      label: 'Neutral', 
      icon: '😐', 
      description: 'Feeling balanced or emotionally steady'
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-3 justify-center">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              value === mood.value 
                ? "border-primary bg-primary/10 shadow-md" 
                : "border-border hover:border-primary/50 hover:bg-muted"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl mb-2">{mood.icon}</span>
            <span className={cn(
              "text-sm font-medium",
              value === mood.value ? "text-primary" : "text-foreground"
            )}>
              {mood.label}
            </span>
            {value === mood.value && (
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-primary rounded-full"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 16 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {value && (
        <motion.div 
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {moods.find(m => m.value === value)?.description}
        </motion.div>
      )}
    </div>
  );
}
