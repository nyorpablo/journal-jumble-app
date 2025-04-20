import React, { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LazyContentProps {
  children: React.ReactNode;
  className?: string;
}

export function LazyContent({ children, className = '' }: LazyContentProps) {
  return (
    <Suspense 
      fallback={
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <div className="text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
