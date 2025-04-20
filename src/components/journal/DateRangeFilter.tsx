"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

interface DateRangeFilterProps {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  onClear: () => void
}

export function DateRangeFilter({ dateRange, setDateRange, onClear }: DateRangeFilterProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="date-range" className="text-xs font-medium">Filter by Date Range</Label>
      <div className="flex gap-2">
        <div className="relative w-full">
          <Button
            id="date-range"
            variant="outline"
            size="default"
            className="w-full justify-start text-left font-normal"
            onClick={() => {
              // Simple toggle for date selection
              if (dateRange) {
                onClear();
              } else {
                const today = new Date();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                setDateRange({ from: oneWeekAgo, to: today });
              }
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </div>
        
        {dateRange && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClear}
            className="flex-shrink-0"
            aria-label="Clear date filter"
          >
            <span className="sr-only">Clear date filter</span>
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}
