"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Typography } from "@/components/atoms/Typography"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { IconButton } from "@/components/atoms/IconButton"
import { Trophy, DollarSign, Bell, Settings, Menu } from "lucide-react"
import { useState } from "react"

interface User {
  name: string
  initials: string
  budget: number
  level: number
}

interface AppHeaderProps {
  user: User
  onMenuToggle?: () => void
  onNotifications?: () => void
  onSettings?: () => void
}

export function AppHeader({ user, onMenuToggle, onNotifications, onSettings }: AppHeaderProps) {
  const [notificationCount] = useState(3)

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Brand & Menu */}
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <IconButton
                icon={Menu}
                variant="ghost"
                onClick={onMenuToggle}
                aria-label="Toggle menu"
                className="text-white hover:bg-slate-800 md:hidden"
              />
            )}

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <Typography variant="h2" className="text-white">
                  Football Manager Pro
                </Typography>
                <Typography variant="caption" className="text-slate-300">
                  Build Your Championship Team
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Budget Display */}
            <StatusBadge status="success" className="bg-green-500/10 text-green-400 border-green-500 hidden sm:flex">
              <DollarSign className="w-4 h-4 mr-1" />${user.budget.toLocaleString()}
            </StatusBadge>

            {/* Notifications */}
            <div className="relative">
              <IconButton
                icon={Bell}
                variant="ghost"
                onClick={onNotifications}
                aria-label="Notifications"
                className="text-white hover:bg-slate-800"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>

            {/* Settings */}
            <IconButton
              icon={Settings}
              variant="ghost"
              onClick={onSettings}
              aria-label="Settings"
              className="text-white hover:bg-slate-800 hidden sm:flex"
            />

            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <Typography variant="body" className="text-white text-sm">
                  {user.name}
                </Typography>
                <Typography variant="caption" className="text-slate-300">
                  Level {user.level}
                </Typography>
              </div>
              <Avatar>
                <AvatarFallback className="bg-green-500 text-white">{user.initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
