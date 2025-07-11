"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, User, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface AppNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const navigationItems: NavigationItem[] = [
  /* { id: "dashboard", label: "Dashboard", icon: Home }, */
  { id: "team", label: "My Team", icon: Users },
  { id: "transfers", label: "Transfer Market", icon: DollarSign },
  /* { id: "profile", label: "Profile", icon: User }, */
]

export function AppNavigation({ activeTab, onTabChange, className }: AppNavigationProps) {
  return (
    <nav className={cn("bg-white border-b border-slate-200 sticky top-16 z-40", className)}>
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent h-14">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "data-[state=active]:bg-green-50 data-[state=active]:text-green-700",
                    "data-[state=active]:border-b-2 data-[state=active]:border-green-500",
                    "flex items-center gap-2 transition-all duration-200",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )
}
