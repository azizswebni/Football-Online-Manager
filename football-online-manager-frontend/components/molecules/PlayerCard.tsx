"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/atoms/Typography"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { IconButton } from "@/components/atoms/IconButton"
import { DollarSign, Plus, Minus, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Player {
  id: string
  name: string
  position: string
  rating: number
  value: string
  team: string
  isOwned?: boolean
  askingPrice?: string
}

interface PlayerCardProps {
  player: Player
  variant?: "owned" | "market" | "compact"
  onBuy?: (playerId: string) => void
  onSell?: (playerId: string) => void
  onAddToTransferList?: (playerId: string) => void
  className?: string
}

export function PlayerCard({
  player,
  variant = "owned",
  onBuy,
  onSell,
  onAddToTransferList,
  className,
}: PlayerCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "success"
    if (rating >= 75) return "info"
    if (rating >= 65) return "warning"
    return "neutral"
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200",
        variant === "market" && "border-l-4 border-l-blue-500",
        variant === "owned" && "border-l-4 border-l-green-500",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback
                className={cn("text-white font-semibold", variant === "market" ? "bg-blue-500" : "bg-green-500")}
              >
                {getInitials(player.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <Typography variant="h4" className="text-slate-900">
                {player.name}
              </Typography>
              <div className="flex items-center space-x-2">
                <StatusBadge status="neutral" size="sm">
                  {player.position}
                </StatusBadge>
                <Typography variant="caption" color="secondary">
                  {player.team}
                </Typography>
                <StatusBadge status={getRatingColor(player.rating)} size="sm">
                  <Star className="w-3 h-3 mr-1" />
                  {player.rating}
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* Value & Actions */}
          <div className="text-right space-y-2">
            <div>
              <Typography variant="h3" className="text-slate-900">
                {player.askingPrice || player.value}
              </Typography>
              {player.askingPrice && (
                <Typography variant="caption" color="secondary">
                  Market Value: {player.value}
                </Typography>
              )}
            </div>

            <div className="flex space-x-2">
              {variant === "market" && onBuy && (
                <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onBuy(player.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Buy
                </Button>
              )}

              {variant === "owned" && (
                <>
                  {onAddToTransferList && (
                    <IconButton
                      icon={DollarSign}
                      size="sm"
                      onClick={() => onAddToTransferList(player.id)}
                      aria-label="Add to transfer list"
                    />
                  )}
                  {onSell && (
                    <IconButton
                      icon={Minus}
                      variant="destructive"
                      size="sm"
                      onClick={() => onSell(player.id)}
                      aria-label="Remove player"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
