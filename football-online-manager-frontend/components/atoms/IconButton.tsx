"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface IconButtonProps {
  icon: LucideIcon
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  "aria-label": string
}

export function IconButton({
  icon: Icon,
  variant = "secondary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className,
  "aria-label": ariaLabel,
}: IconButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant={variant === "primary" ? "default" : variant}
      size="icon"
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(sizeClasses[size], className)}
      aria-label={ariaLabel}
    >
      {loading ? (
        <div
          className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", iconSizes[size])}
        />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </Button>
  )
}
