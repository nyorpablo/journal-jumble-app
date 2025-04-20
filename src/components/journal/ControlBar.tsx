"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { SearchBar } from "./SearchBar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { 
  SlidersHorizontal, 
  CalendarRange, 
  Clock, 
  ArrowDownAZ, 
  X, 
  ArrowUpAZ,
  Calendar,
  Tag,
  Search
} from "lucide-react"

// Define mood metadata for visual styling
const MOOD_METADATA = {
  'Happy': { color: 'bg-yellow-100 border-yellow-300 text-yellow-700', icon: '😊' },
  'Sad': { color: 'bg-blue-100 border-blue-300 text-blue-700', icon: '😔' },
  'Anxious': { color: 'bg-purple-100 border-purple-300 text-purple-700', icon: '😰' },
  'Productive': { color: 'bg-green-100 border-green-300 text-green-700', icon: '💪' },
  'Neutral': { color: 'bg-gray-100 border-gray-300 text-gray-700', icon: '😐' }
}

const MOODS: Array<keyof typeof MOOD_METADATA> = ['Happy', 'Sad', 'Anxious', 'Productive', 'Neutral'];

type Mood = keyof typeof MOOD_METADATA;
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'modified';
type SortOrder = 'asc' | 'desc';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface FilterState {
  mood?: Mood | null;
  tag?: string | null;
  dateRange?: DateRange | null;
}

interface ControlBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterState) => void;
  onSortChange: (sort: { key: SortOption; order: SortOrder }) => void;
  activeFilters?: FilterState;
  activeSort?: { key: SortOption; order: SortOrder };
}

export function ControlBar({
  onSearch,
  onFilterChange,
  onSortChange,
  activeFilters = {},
  activeSort = { key: 'newest', order: 'desc' }
}: ControlBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterMood, setFilterMood] = React.useState<Mood | null>(activeFilters.mood || null)
  const [filterTag, setFilterTag] = React.useState<string | null>(activeFilters.tag || null)
  const [dateRange, setDateRange] = React.useState<DateRange | null>(activeFilters.dateRange || null)
  const [sortKey, setSortKey] = React.useState<SortOption>(activeSort.key)
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(activeSort.order)

  // Update parent component when filters change
  React.useEffect(() => {
    onFilterChange({
      mood: filterMood,
      tag: filterTag,
      dateRange: dateRange
    })
  }, [filterMood, filterTag, dateRange, onFilterChange])

  // Update parent component when sort changes
  React.useEffect(() => {
    onSortChange({
      key: sortKey,
      order: sortOrder
    })
  }, [sortKey, sortOrder, onSortChange])

  // Handle search queries
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilterMood(null)
    setFilterTag(null)
    setDateRange(null)
  }

  // Check if any filters are active
  const hasActiveFilters = filterMood || filterTag || dateRange

  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          onClear={() => handleSearch('')}
          placeholder="Search journal entries..."
          className="flex-1"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full">
                    {Object.values({ mood: filterMood, tag: filterTag, date: dateRange }).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            {/* @ts-ignore - shadcn/ui component type definition issue */}
            <DropdownMenuContent align="start" className="w-56" sideOffset={4}>
              {/* @ts-ignore - shadcn/ui component type definition issue */}
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              
              {/* Mood Filter */}
              <div className="p-2">
                <Label className="text-xs font-medium mb-1.5 block">Mood</Label>
                <div className="grid grid-cols-5 gap-1">
                  {MOODS.map((mood) => (
                    <Tooltip key={mood}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            filterMood === mood && MOOD_METADATA[mood].color
                          )}
                          onClick={() => setFilterMood(filterMood === mood ? null : mood)}
                        >
                          <span>{MOOD_METADATA[mood].icon}</span>
                        </Button>
                      </TooltipTrigger>
                      {/* @ts-ignore - shadcn/ui component type definition issue */}
                      <TooltipContent className="px-2 py-1" side="bottom" sideOffset={4}>{mood}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Tag Filter */}
              <div className="p-2">
                <Label className="text-xs font-medium mb-1.5 block">Tag</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Filter by tag..."
                    className="h-8 text-xs"
                    value={filterTag || ''}
                    onChange={(e) => setFilterTag(e.target.value || null)}
                  />
                  {filterTag && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setFilterTag(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Date Range Filter - Simple Version */}
              <div className="p-2">
                <Label className="text-xs font-medium mb-1.5 block">Date Range</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs h-8 gap-2"
                  onClick={() => setDateRange(dateRange ? null : { from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() })}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {dateRange ? 'Clear date range' : 'Set last 7 days'}
                </Button>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs h-8 mt-1"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active Filter Pills */}
          {filterMood && (
            <Badge
              variant="outline"
              className={cn("gap-1 px-2 py-0 h-8", MOOD_METADATA[filterMood].color)}
            >
              <span>{MOOD_METADATA[filterMood].icon}</span>
              <span>{filterMood}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => setFilterMood(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filterTag && (
            <Badge variant="outline" className="gap-1 px-2 py-0 h-8">
              <Tag className="h-3.5 w-3.5" />
              <span>{filterTag}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => setFilterTag(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {dateRange && (
            <Badge variant="outline" className="gap-1 px-2 py-0 h-8">
              <Calendar className="h-3.5 w-3.5" />
              <span>Date filter</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => setDateRange(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortOption)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            {/* @ts-ignore - shadcn/ui component type definition issue */}
            <SelectContent className="min-w-[130px]">
              {/* @ts-ignore - shadcn/ui component type definition issue */}
              <SelectItem className="text-xs" value="newest">Date Created</SelectItem>
              {/* @ts-ignore - shadcn/ui component type definition issue */}
              <SelectItem className="text-xs" value="modified">Last Modified</SelectItem>
              {/* @ts-ignore - shadcn/ui component type definition issue */}
              <SelectItem className="text-xs" value="alphabetical">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <ArrowUpAZ className="h-4 w-4" />
            ) : (
              <ArrowDownAZ className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
