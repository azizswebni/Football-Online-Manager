"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Filter, Search, X, Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FilterOption {
  key: string
  label: string
  options?: string[] // for select/combobox
  type?: "select" | "slider" | "combobox"
  min?: number
  max?: number
  step?: number
  defaultValue?: [number, number]
}

interface SearchFilterProps {
  placeholder?: string
  filters?: FilterOption[]
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, any>) => void
  className?: string
}

export function SearchFilter({
  placeholder = "Search...",
  filters = [],
  onSearch,
  onFilter,
  className,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [openComboboxes, setOpenComboboxes] = useState<Record<string, boolean>>({})

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFilter?.(newFilters)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[key]
    setActiveFilters(newFilters)
    onFilter?.(newFilters)
  }

  const toggleCombobox = (key: string, isOpen: boolean) => {
    setOpenComboboxes(prev => ({ ...prev, [key]: isOpen }))
  }

  const formatFilterValue = (filter: FilterOption, value: any) => {
    if (filter.type === "slider" && Array.isArray(value)) {
      return `$${value[0].toLocaleString()} - $${value[1].toLocaleString()}`
    }
    return value
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => {
      const value = activeFilters[key]
      if (Array.isArray(value)) {
        const filter = filters.find(f => f.key === key)
        if (filter && filter.type === "slider") {
          return value[0] !== filter.min || value[1] !== filter.max
        }
      }
      return value !== "" && value !== undefined && value !== null
    }).length
  }

  const renderFilterInput = (filter: FilterOption) => {
    if (filter.type === "slider") {
      return (
        <div className="space-y-3">
          <Slider
            value={activeFilters[filter.key] || filter.defaultValue || [filter.min!, filter.max!]}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
            min={filter.min}
            max={filter.max}
            step={filter.step || 1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>${filter.min?.toLocaleString()}</span>
            <span>${filter.max?.toLocaleString()}</span>
          </div>
          <div className="text-center text-sm text-slate-600">
            ${(activeFilters[filter.key] || filter.defaultValue || [filter.min!, filter.max!])[0].toLocaleString()} - 
            ${(activeFilters[filter.key] || filter.defaultValue || [filter.min!, filter.max!])[1].toLocaleString()}
          </div>
        </div>
      )
    }

    if (filter.type === "combobox") {
      return (
        <Popover 
          open={openComboboxes[filter.key] || false} 
          onOpenChange={(open) => toggleCombobox(filter.key, open)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openComboboxes[filter.key] || false}
              className="w-full justify-between"
            >
              {activeFilters[filter.key] || `Select ${filter.label.toLowerCase()}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>No {filter.label.toLowerCase()} found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value=""
                    onSelect={() => {
                      handleFilterChange(filter.key, "")
                      toggleCombobox(filter.key, false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !activeFilters[filter.key] ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All {filter.label}
                  </CommandItem>
                  {filter.options?.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        handleFilterChange(filter.key, option)
                        toggleCombobox(filter.key, false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          activeFilters[filter.key] === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    }

    // Default select type
    return (
      <select
        value={activeFilters[filter.key] || ""}
        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
        className="w-full p-2 border border-slate-300 rounded-md text-sm"
      >
        <option value="">All {filter.label}</option>
        {filter.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              const filter = filters.find(f => f.key === key)
              if (!filter) return null
              
              const shouldShow = filter.type === "slider" 
                ? Array.isArray(value) && (value[0] !== filter.min || value[1] !== filter.max)
                : value !== "" && value !== undefined && value !== null

              if (!shouldShow) return null

              return (
                <div
                  key={key}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {filter.label}: {formatFilterValue(filter, value)}
                  <button onClick={() => clearFilter(key)} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Filter Options */}
        {showFilters && filters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}