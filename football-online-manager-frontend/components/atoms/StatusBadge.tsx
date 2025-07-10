import type React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "neutral"
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusBadge({ status, children, size = "md", className }: StatusBadgeProps) {
  const statusClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-slate-100 text-slate-800 border-slate-200",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  }

  return (
    <Badge variant="outline" className={cn(statusClasses[status], sizeClasses[size], className)}>
      {children}
    </Badge>
  )
}
