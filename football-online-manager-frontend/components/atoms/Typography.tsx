import type React from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "display"
  weight?: "normal" | "medium" | "semibold" | "bold"
  color?: "primary" | "secondary" | "accent" | "muted"
  className?: string
  children: React.ReactNode
}

export function Typography({
  variant = "body",
  weight = "normal",
  color = "primary",
  className,
  children,
}: TypographyProps) {
  const baseClasses = "font-primary"

  const variantClasses = {
    display: "text-4xl font-display font-bold",
    h1: "text-3xl font-display font-bold",
    h2: "text-2xl font-display font-semibold",
    h3: "text-xl font-display font-semibold",
    h4: "text-lg font-medium",
    body: "text-base",
    caption: "text-sm",
  }

  const colorClasses = {
    primary: "text-slate-900",
    secondary: "text-slate-600",
    accent: "text-green-600",
    muted: "text-slate-500",
  }

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }

  const Component = variant.startsWith("h") ? (variant as keyof JSX.IntrinsicElements) : "p"

  return (
    <Component
      className={cn(baseClasses, variantClasses[variant], colorClasses[color], weightClasses[weight], className)}
    >
      {children}
    </Component>
  )
}
