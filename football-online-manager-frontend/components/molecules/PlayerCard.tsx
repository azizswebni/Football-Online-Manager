"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Typography } from "@/components/atoms/Typography"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { DollarSign, Plus, Minus, TrendingUp, X, Check, Loader2, AlertCircle, Star, User, Calendar } from "lucide-react"
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
  const [priceError, setPriceError] = useState<string | null>(null)

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }, [])

  const getOverallRatingColor = useCallback((overall: number) => {
    if (overall >= 90) return "text-purple-600 bg-purple-100"
    if (overall >= 85) return "text-blue-600 bg-blue-100"
    if (overall >= 80) return "text-green-600 bg-green-100"
    if (overall >= 75) return "text-yellow-600 bg-yellow-100"
    if (overall >= 70) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }, [])

  const getOverallRatingText = useCallback((overall: number) => {
    if (overall >= 90) return "Elite"
    if (overall >= 85) return "Excellent"
    if (overall >= 80) return "Very Good"
    if (overall >= 75) return "Good"
    if (overall >= 70) return "Average"
    return "Below Average"
  }, [])

  const validatePrice = useCallback((price: string): boolean => {
    const numPrice = parseFloat(price)
    
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError("Price must be a positive number")
      return false
    }
    
    if (player.value && numPrice < player.value * 0.1) {
      setPriceError("Price cannot be less than 10% of market value")
      return false
    }
    
    setPriceError(null)
    return true
  }, [player.value])

  const handlePriceChange = useCallback((value: string) => {
    setAskingPrice(value)
    if (value) {
      validatePrice(value)
    } else {
      setPriceError(null)
    }
  }, [validatePrice])

  const handleAddToTransferMarket = useCallback(() => {
    if (!validatePrice(askingPrice)) return
    
    const price = parseFloat(askingPrice)
    if (price > 0 && onAddToTransferList) {
      onAddToTransferList(player.id, price)
      setIsTransferDialogOpen(false)
      setPriceError(null)
    }
  }, [askingPrice, validatePrice, onAddToTransferList, player.id])

  const handleRemoveFromTransferMarket = useCallback(() => {
    if (onRemoveFromTransferList && player.transferId) {
      onRemoveFromTransferList(player.id)
    }
  }, [onRemoveFromTransferList, player.id, player.transferId])

  const handleSellPlayer = useCallback(() => {
    if (onSell) {
      onSell(player.id)
    }
  }, [onSell, player.id])

  const handleBuyPlayer = useCallback(() => {
    if (onBuy) {
      onBuy(player.id)
    }
  }, [onBuy, player.id])

  const handleDialogClose = useCallback(() => {
    setIsTransferDialogOpen(false)
    setAskingPrice(player.value?.toString() || "")
    setPriceError(null)
  }, [player.value])

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

  const isFormValid = askingPrice && !priceError && parseFloat(askingPrice) > 0

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200",
          player.isInTransferMarket && "border-l-4 border-l-orange-500",
          variant === "owned" && !player.isInTransferMarket && "border-l-4 border-l-green-500",
          variant === "market" && "border-l-4 border-l-blue-500",
          isLoading && "opacity-75 pointer-events-none",
          className,
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback
                  className={cn(
                    "text-white font-semibold text-sm",
                    variant === "market" && "bg-blue-500",
                    variant === "owned" && !player.isInTransferMarket && "bg-green-500",
                    player.isInTransferMarket && "bg-orange-500"
                  )}
                >
                  {getInitials(player.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <Typography variant="body" className="text-slate-900 font-medium">
                  {player.name}
                </Typography>
                <div className="flex items-center space-x-2">
                  <StatusBadge status="neutral" size="sm">
                    {player.position}
                  </StatusBadge>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    getOverallRatingColor(player.overall)
                  )}>
                    {player.overall}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Typography variant="caption" className="text-slate-600">
                ${player.value.toLocaleString()}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200",
        variant === "market" && "border-l-4 border-l-blue-500",
        variant === "owned" && !player.isInTransferMarket && "border-l-4 border-l-green-500",
        player.isInTransferMarket && "border-l-4 border-l-orange-500",
        isLoading && "opacity-75 pointer-events-none",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with Player Name and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback
                  className={cn(
                    "text-white font-bold text-lg",
                    variant === "market" && "bg-blue-500",
                    variant === "owned" && !player.isInTransferMarket && "bg-green-500",
                    player.isInTransferMarket && "bg-orange-500"
                  )}
                >
                  {getInitials(player.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
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
              <div className={cn(
                "px-4 py-2 rounded-lg text-center",
                getOverallRatingColor(player.overall)
              )}>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span className="text-2xl font-bold">{player.overall}</span>
                </div>
                <Typography variant="caption" className="font-medium">
                  {getOverallRatingText(player.overall)}
                </Typography>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <Typography variant="caption" color="secondary">
                  Age
                </Typography>
                <Typography variant="body" className="font-medium">
                  {player.age} years
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <Typography variant="caption" color="secondary">
                  Position
                </Typography>
                <Typography variant="body" className="font-medium">
                  {player.position}
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <div>
                <Typography variant="caption" color="secondary">
                  Market Value
                </Typography>
                <Typography variant="body" className="font-medium">
                  ${player.value.toLocaleString()}
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-slate-500" />
              <div>
                <Typography variant="caption" color="secondary">
                  Overall Rating
                </Typography>
                <Typography variant="body" className="font-medium">
                  {player.overall}/100
                </Typography>
              </div>
            </div>
          </div>

          {/* Transfer Market Info */}
          {player.isInTransferMarket && player.askingPrice && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <Typography variant="body" className="text-orange-800 font-medium">
                    Listed on Transfer Market
                  </Typography>
                </div>
                <Typography variant="body" className="text-orange-600 font-bold">
                  ${player.askingPrice.toLocaleString()}
                </Typography>
              </div>
              {player.transferId && (
                <Typography variant="caption" className="text-orange-600 mt-1">
                  Transfer ID: {player.transferId}
                </Typography>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {variant === "market" && onBuy && (
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600" 
                onClick={handleBuyPlayer}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-1" />
                )}
                Buy for ${player.askingPrice?.toLocaleString() || player.value.toLocaleString()}
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
                    disabled={isLoading || !player.transferId}
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        disabled={isLoading}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        List for Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      className="sm:max-w-[500px]"
                      onInteractOutside={handleDialogClose}
                      onEscapeKeyDown={handleDialogClose}
                    >
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-green-500 text-white text-sm font-semibold">
                              {getInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>Add {player.name} to Transfer Market</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Player Summary */}
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <Typography variant="caption" color="secondary">Overall</Typography>
                              <Typography variant="body" className="font-bold">{player.overall}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" color="secondary">Age</Typography>
                              <Typography variant="body" className="font-bold">{player.age}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" color="secondary">Position</Typography>
                              <Typography variant="body" className="font-bold">{player.position}</Typography>
                            </div>
                          </div>
                        </div>

                        {/* Price Settings */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="market-value">Market Value</Label>
                            <Input
                              id="market-value"
                              value={`$${player.value.toLocaleString()}`}
                              disabled
                            />
                          </div>
                          <div>
                            <Label htmlFor="asking-price">Asking Price</Label>
                            <Input
                              id="asking-price"
                              type="number"
                              value={askingPrice}
                              onChange={(e) => handlePriceChange(e.target.value)}
                              placeholder="Enter asking price"
                              min="0"
                              step="1000"
                              className={cn(
                                priceError && "border-red-500 focus:border-red-500"
                              )}
                            />
                            {priceError && (
                              <div className="flex items-center mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {priceError}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Typography variant="caption" color="secondary">
                            💡 Tip: Players typically sell for 80-120% of their market value. Higher rated players may command premium prices.
                          </Typography>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddToTransferMarket}
                            disabled={!isFormValid || isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-1" />
                            )}
                            Add to Market
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}