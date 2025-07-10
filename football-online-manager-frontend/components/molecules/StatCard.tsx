import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/atoms/Typography"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    direction: "up" | "down"
  }
  color?: "green" | "blue" | "yellow" | "purple" | "red"
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, color = "green", className }: StatCardProps) {
  const colorClasses = {
    green: "border-l-green-500",
    blue: "border-l-blue-500",
    yellow: "border-l-yellow-500",
    purple: "border-l-purple-500",
    red: "border-l-red-500",
  }

  return (
    <Card className={cn("border-l-4", colorClasses[color], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-600" />
      </CardHeader>
      <CardContent>
        <Typography variant="h2" className="text-slate-900">
          {value}
        </Typography>
        {trend && (
          <div className="flex items-center mt-1">
            {trend.direction === "up" ? (
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
            )}
            <Typography variant="caption" color={trend.direction === "up" ? "accent" : "secondary"}>
              {trend.direction === "up" ? "+" : ""}
              {trend.value}% {trend.label}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
