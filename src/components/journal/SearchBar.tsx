"use client"

import * as React from "react"
import { Search, X, Filter, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  className?: string
  searchOptions?: {
    searchInTitles: boolean
    searchInContent: boolean
    searchInTags: boolean
    caseSensitive: boolean
  }
  onSearchOptionsChange?: (options: any) => void
  disabled?: boolean
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search entries...",
  className,
  searchOptions = {
    searchInTitles: true,
    searchInContent: true,
    searchInTags: false,
    caseSensitive: false
  },
  onSearchOptionsChange,
  disabled = false
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      
      // Escape to clear search when focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current && value) {
        e.preventDefault()
        onClear()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [value, onClear])
  
  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors",
        isFocused && "text-primary"
      )}>
        <Search className="h-4 w-4" />
      </div>
      
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pl-10 pr-16 h-10 transition-all duration-200",
          isFocused ? "ring-1 ring-primary border-primary/50" : "border-input hover:border-primary/30",
          disabled && "opacity-70 cursor-not-allowed"
        )}
      />
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onClear}
            disabled={disabled}
            className="h-7 w-7 rounded-full hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {onSearchOptionsChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled}
                className="h-7 w-7 rounded-full hover:bg-muted"
                aria-label="Search options"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={searchOptions.searchInTitles}
                onCheckedChange={(checked) => {
                  onSearchOptionsChange({
                    ...searchOptions,
                    searchInTitles: checked
                  })
                }}
              >
                Search in titles
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchOptions.searchInContent}
                onCheckedChange={(checked) => {
                  onSearchOptionsChange({
                    ...searchOptions,
                    searchInContent: checked
                  })
                }}
              >
                Search in content
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchOptions.searchInTags}
                onCheckedChange={(checked) => {
                  onSearchOptionsChange({
                    ...searchOptions,
                    searchInTags: checked
                  })
                }}
              >
                Search in tags
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={searchOptions.caseSensitive}
                onCheckedChange={(checked) => {
                  onSearchOptionsChange({
                    ...searchOptions,
                    caseSensitive: checked
                  })
                }}
              >
                Case sensitive
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity pointer-events-none">
        {!value && "Ctrl+F"}
      </div>
    </div>
  )
}
