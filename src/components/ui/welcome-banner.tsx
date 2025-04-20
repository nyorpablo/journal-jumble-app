import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    {
      title: "Welcome to Journal Dashboard",
      description: "Track your thoughts, moods, and reflections in one beautiful place.",
      icon: "📓"
    },
    {
      title: "Track Your Moods",
      description: "Select a mood for each entry to visualize your emotional patterns over time.",
      icon: "😊"
    },
    {
      title: "Use Tags",
      description: "Add tags to your entries to organize and filter your journal easily.",
      icon: "🏷️"
    },
    {
      title: "Search & Filter",
      description: "Find past entries quickly with powerful search and filtering options.",
      icon: "🔍"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [tips.length]);
  
  const tip = tips[currentTip];
  
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/10 animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-70 hover:opacity-100"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{tip.icon}</div>
          <div className="space-y-2 flex-1">
            <h3 className="font-heading text-lg font-semibold">{tip.title}</h3>
            <p className="text-muted-foreground">{tip.description}</p>
            
            <div className="flex items-center gap-1 mt-4">
              {tips.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentTip 
                      ? 'w-6 bg-primary' 
                      : 'w-1.5 bg-primary/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
