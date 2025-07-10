"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { useState } from "react"

interface FilterOption {
  key: string
  label: string
  options: string[]
}

interface SearchFilterProps {
  placeholder?: string
  filters?: FilterOption[]
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, string>) => void
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (key: string, value: string) => {
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
            {Object.keys(activeFilters).length > 0 && (
              <span className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <div
                key={key}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {key}: {value}
                <button onClick={() => clearFilter(key)} className="hover:bg-green-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Filter Options */}
        {showFilters && filters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{filter.label}</label>
                <select
                  value={activeFilters[filter.key] || ""}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="">All {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
