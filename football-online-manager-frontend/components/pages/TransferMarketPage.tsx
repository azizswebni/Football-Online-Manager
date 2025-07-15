"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Typography } from "@/components/atoms/Typography"
import { PlayerCard } from "@/components/molecules/PlayerCard"
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { DollarSign, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTeamStore } from "@/store/team.store"
import { 
  getTransferMarketPlayersService, 
  buyPlayerTransferMarketService, 
} from "@/services/market.service"
import { getTeamService } from "@/services/team.service"
import { toast } from "sonner"
import { TransferMarketFilters, TransferPlayer } from "@/lib/interfaces"
import { positions } from "@/lib/consts"
import { AxiosError } from "axios"

// Query keys
const QUERY_KEYS = {
  TEAM: ['team'],
  TRANSFER_MARKET: ['transfer-market'],
}

interface BuyPlayerMutationData {
  transferId: string
  transfer: TransferPlayer
}

export function TransferMarketPage() {
  const { team, setTeam } = useTeamStore()
  const queryClient = useQueryClient()
  
  const [transfers, setTransfers] = useState<TransferPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TransferMarketFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  const filterOptions = [
    { 
      key: "position", 
      label: "Position", 
      options: positions
    },
    { 
      key: "priceRange", 
      label: "Price Range", 
      options: ["Under 100K", "100K-500K", "500K-1M", "1M-2M", "2M-5M", "Over 5M"] 
    },
  ]

  // Buy Player Mutation
  const buyPlayerMutation = useMutation({
    mutationFn: async ({ transferId }: { transferId: string }) => {
      await buyPlayerTransferMarketService(transferId)
      return { transferId }
    },
    onMutate: async ({ transferId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TEAM })
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TRANSFER_MARKET })

      // Find the transfer being purchased
      const transfer = transfers.find(t => t.id === transferId)
      
      // Optimistically remove the player from transfer market
      setTransfers(prevTransfers => 
        prevTransfers.filter(t => t.id !== transferId)
      )

      // Return context for rollback
      return { transferId, transfer }
    },
    onSuccess: async ({ transferId }) => {
      const transfer = transfers.find(t => t.id === transferId)
      if (transfer) {
        toast.success(`Successfully purchased ${transfer.player.name} for $${transfer.askingPrice.toLocaleString()}!`)
      } else {
        toast.success("Player purchased successfully!")
      }
      
      // Refresh team data
      try {
        const teamData = await getTeamService()
        setTeam(teamData)
      } catch (error) {
        console.error("Error refreshing team data:", error)
      }
      
      // Refresh transfer market
      loadTransferMarket(filters)
    },
    onError: (error: AxiosError<{ error: string; message: string }>, { transferId }, context) => {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to purchase player. Please try again.'
      
      // Rollback optimistic update
      if (context?.transfer) {
        setTransfers(prevTransfers => [...prevTransfers, context.transfer!])
      }
      
      toast.error(errorMessage)
    }
  })

  const loadTransferMarket = async (appliedFilters?: TransferMarketFilters) => {
    try {
      setLoading(true)
      const response = await getTransferMarketPlayersService(appliedFilters)
      setTransfers(response.transfers)
    } catch (error) {
      console.error("Error loading transfer market:", error)
      toast.error("Failed to load transfer market")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransferMarket()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const newFilters = {
      ...filters,
      playerName: query || undefined,
    }
    setFilters(newFilters)
    loadTransferMarket(newFilters)
  }

  const handleFilter = (filterData: any) => {
    const newFilters: TransferMarketFilters = { ...filters }
    
    // Handle position filter
    if (filterData.position) {
      newFilters.position = filterData.position
    } else {
      delete newFilters.position
    }

    // Handle price range filter
    if (filterData.priceRange) {
      const priceRange = filterData.priceRange
      if (priceRange === "Under 100K") {
        newFilters.maxPrice = 100000
        delete newFilters.minPrice
      } else if (priceRange === "100K-500K") {
        newFilters.minPrice = 100000
        newFilters.maxPrice = 500000
      } else if (priceRange === "500K-1M") {
        newFilters.minPrice = 500000
        newFilters.maxPrice = 1000000
      } else if (priceRange === "1M-2M") {
        newFilters.minPrice = 1000000
        newFilters.maxPrice = 2000000
      } else if (priceRange === "2M-5M") {
        newFilters.minPrice = 2000000
        newFilters.maxPrice = 5000000
      } else if (priceRange === "Over 5M") {
        newFilters.minPrice = 5000000
        delete newFilters.maxPrice
      }
    } else {
      delete newFilters.minPrice
      delete newFilters.maxPrice
    }

    setFilters(newFilters)
    loadTransferMarket(newFilters)
  }

  const handleBuyPlayer = async (transferId: string) => {
    // Check if user has enough budget
    const transfer = transfers.find(t => t.id === transferId)
    if (transfer && team && team.budget < transfer.askingPrice) {
      toast.error(`Insufficient budget. You need $${transfer.askingPrice.toLocaleString()} but only have $${team.budget.toLocaleString()}`)
      return
    }

    // Check if trying to buy own player
    if (transfer && team && transfer.sellingTeam.name === team.name) {
      toast.error("You cannot buy your own player")
      return
    }

    buyPlayerMutation.mutate({ transferId })
  }

  const handleRefresh = () => {
    loadTransferMarket(filters)
  }

  // Convert TransferPlayer to Player format for PlayerCard
  const convertToPlayer = (transfer: TransferPlayer) => ({
    id: transfer.id, // Using transfer ID as the main ID
    playerId: transfer.player.id, // Store actual player ID separately
    name: transfer.player.name,
    position: transfer.player.position,
    age: transfer.player.age,
    overall: transfer.player.overall,
    value: transfer.player.value,
    askingPrice: transfer.askingPrice,
    team: transfer.sellingTeam.name,
    isOwned: false,
    isInTransferMarket: true,
    transferId: transfer.id,
    createdAt: transfer.createdAt,
  })

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    } else {
      return `$${price}`
    }
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <Typography variant="display" className="text-slate-900">
          No Team Created Yet
        </Typography>
        <Typography variant="body" color="secondary">
          Your team not yet created. We are working on it !
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="display" className="text-slate-900">
            Transfer Market
          </Typography>
          <Typography variant="body" color="secondary">
            Discover and acquire new talent
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="info" size="sm">
            {transfers.length} Players Available
          </StatusBadge>
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-md px-3 py-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <Typography variant="caption" className="text-green-700 font-medium">
              Budget: {formatPrice(team.budget)}
            </Typography>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        placeholder="Search players, teams, or positions..."
        filters={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <Typography variant="body" className="ml-2 text-slate-600">
            Loading transfer market...
          </Typography>
        </div>
      )}

      {/* Error State */}
      {!loading && transfers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400" />
          <Typography variant="h3" className="text-slate-600">
            No Players Available
          </Typography>
          <Typography variant="body" color="secondary">
            {searchQuery || Object.keys(filters).length > 0 
              ? "No players match your search criteria. Try adjusting your filters."
              : "The transfer market is currently empty. Check back later for new listings."
            }
          </Typography>
          {(searchQuery || Object.keys(filters).length > 0) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilters({})
                loadTransferMarket()
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Available Players */}
      {!loading && transfers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3" className="text-slate-900">
              Available Players
            </Typography>
            <Typography variant="body" color="secondary">
              {transfers.length} player{transfers.length !== 1 ? 's' : ''} found
            </Typography>
          </div>

          {transfers.map((transfer) => {
            const player = convertToPlayer(transfer)
            const isCurrentlyBuying = buyPlayerMutation.isPending && buyPlayerMutation.variables?.transferId === transfer.id
            const canAfford = team.budget >= transfer.askingPrice
            const isOwnPlayer = transfer.sellingTeam.name === team.name
            
            return (
              <div key={transfer.id} className="relative">
                <PlayerCard 
                  player={player}
                  variant="market" 
                  onBuy={() => handleBuyPlayer(transfer.id)}
                  isLoading={isCurrentlyBuying}
                />
                
                {/* Price Breakdown */}
                <div className={`absolute top-4 right-4 border rounded-md p-2 space-y-1 ${
                  !canAfford 
                    ? 'bg-red-50 border-red-200' 
                    : isOwnPlayer 
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <Typography variant="caption" className={`font-medium ${
                    !canAfford 
                      ? 'text-red-700' 
                      : isOwnPlayer 
                        ? 'text-gray-700'
                        : 'text-blue-700'
                  }`}>
                    Asking Price: {formatPrice(transfer.askingPrice)}
                  </Typography>
                  <Typography variant="caption" className={
                    !canAfford 
                      ? 'text-red-600' 
                      : isOwnPlayer 
                        ? 'text-gray-600'
                        : 'text-blue-600'
                  }>
                    Market Value: {formatPrice(transfer.player.value)}
                  </Typography>
                  <Typography variant="caption" className={
                    !canAfford 
                      ? 'text-red-500' 
                      : isOwnPlayer 
                        ? 'text-gray-500'
                        : 'text-blue-500'
                  }>
                    Listed by: {transfer.sellingTeam.name}
                  </Typography>
                  
                  {!canAfford && (
                    <Typography variant="caption" className="text-red-600 font-medium">
                      Insufficient Budget
                    </Typography>
                  )}
                  
                  {isOwnPlayer && (
                    <Typography variant="caption" className="text-gray-600 font-medium">
                      Your Player
                    </Typography>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}