"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Typography } from "@/components/atoms/Typography"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { IconButton } from "@/components/atoms/IconButton"
import { DollarSign, Plus, Minus, Star, TrendingUp, X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Player } from "@/lib/interfaces"

interface PlayerCardProps {
  player: Player
  variant?: "owned" | "market" | "compact"
  onBuy?: (playerId: string) => void
  onSell?: (playerId: string) => void
  onAddToTransferList?: (playerId: string, askingPrice: number) => void
  onRemoveFromTransferList?: (playerId: string) => void
  isLoading?: boolean
  className?: string
}

export function PlayerCard({
  player,
  variant = "owned",
  onBuy,
  onSell,
  onAddToTransferList,
  onRemoveFromTransferList,
  isLoading = false,
  className,
}: PlayerCardProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [askingPrice, setAskingPrice] = useState(player.value?.toString() || "")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleAddToTransferMarket = () => {
    const price = parseFloat(askingPrice)
    if (price > 0 && onAddToTransferList) {
      onAddToTransferList(player.id, price)
      setIsTransferDialogOpen(false)
    }
  }

  const handleRemoveFromTransferMarket = () => {
    if (onRemoveFromTransferList) {
      onRemoveFromTransferList(player.id)
    }
  }

  const getTransferStatus = () => {
    if (player.isInTransferMarket) {
      return (
        <StatusBadge status="warning" size="sm">
          <TrendingUp className="w-3 h-3 mr-1" />
          On Transfer Market
        </StatusBadge>
      )
    }
    return null
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200",
        variant === "market" && "border-l-4 border-l-blue-500",
        variant === "owned" && "border-l-4 border-l-green-500",
        player.isInTransferMarket && "border-l-4 border-l-orange-500",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback
                className={cn(
                  "text-white font-semibold",
                  variant === "market" && "bg-blue-500",
                  variant === "owned" && !player.isInTransferMarket && "bg-green-500",
                  player.isInTransferMarket && "bg-orange-500"
                )}
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
                {getTransferStatus()}
              </div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="space-y-1">
              {player.value && (
                <Typography variant="caption" color="secondary">
                  Market Value: ${player.value.toLocaleString()}
                </Typography>
              )}
              {player.isInTransferMarket && player.askingPrice && (
                <Typography variant="caption" className="text-orange-600 font-medium">
                  Asking Price: ${player.askingPrice.toLocaleString()}
                </Typography>
              )}
            </div>

            <div className="flex space-x-2">
              {variant === "market" && onBuy && (
                <Button 
                  size="sm" 
                  className="bg-green-500 hover:bg-green-600" 
                  onClick={() => onBuy(player.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-1" />
                  )}
                  Buy
                </Button>
              )}

              {variant === "owned" && (
                <>
                  {player.isInTransferMarket ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      onClick={handleRemoveFromTransferMarket}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      Remove from Market
                    </Button>
                  ) : (
                    <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                      <DialogTrigger asChild>
                        <IconButton
                          icon={DollarSign}
                          size="sm"
                          disabled={isLoading}
                          aria-label="Add to transfer list"
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add {player.name} to Transfer Market</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="market-value">Market Value</Label>
                              <Input
                                id="market-value"
                                value={`$${player.value?.toLocaleString()}`}
                                disabled
                              />
                            </div>
                            <div>
                              <Label htmlFor="asking-price">Asking Price</Label>
                              <Input
                                id="asking-price"
                                type="number"
                                value={askingPrice}
                                onChange={(e) => setAskingPrice(e.target.value)}
                                placeholder="Enter asking price"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsTransferDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddToTransferMarket}
                              disabled={!askingPrice || parseFloat(askingPrice) <= 0}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Add to Market
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {onSell && (
                    <IconButton
                      icon={Minus}
                      variant="destructive"
                      size="sm"
                      onClick={() => onSell(player.id)}
                      disabled={isLoading}
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