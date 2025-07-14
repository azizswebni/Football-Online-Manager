"use client"

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Typography } from "@/components/atoms/Typography"
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Shield, Zap, Trophy } from "lucide-react"
import { useTeamStore } from "@/store/team.store"
import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Player } from "@/lib/interfaces"
import { PlayerCard } from "../molecules/PlayerCard"
import { toast } from "sonner"
import { 
  addPlayerToTransferMarketService, 
  removePlayerFromTransferMarketService 
} from "@/services/market.service"
import { getTeamService } from "@/services/team.service"

// Query keys for React Query
const QUERY_KEYS = {
  TRANSFER_MARKET: ['transferMarket'],
  TEAM: ['team'],
  PLAYERS: ['players']
} as const

interface TransferMarketMutationData {
  playerId: string
  askingPrice: number
}

interface RemoveFromMarketMutationData {
  playerId: string
  transferId: string
}

export function TeamPage() {
  const { team, updatePlayer,setTeam } = useTeamStore()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  
  const searchParams = useSearchParams()

  // Add to transfer market mutation
  const addToTransferMarketMutation = useMutation({
    mutationFn: async ({ playerId, askingPrice }: TransferMarketMutationData) => {
      await addPlayerToTransferMarketService({ playerId, askingPrice })
      return { playerId, askingPrice }
    },
    onMutate: async ({ playerId, askingPrice }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TEAM })

      // Return context for rollback
      return { playerId, askingPrice }
    },
    onSuccess: async ({ askingPrice }) => {
      toast.success(`Player added to transfer market for $${askingPrice.toLocaleString()}`)
      const teamData = await getTeamService();
      setTeam(teamData);
    },
    onError: (error, { playerId }) => {
      console.error('Failed to add player to transfer market:', error)
      
      // Rollback optimistic update
      updatePlayer(playerId, {
        isInTransferMarket: false,
        askingPrice: undefined,
        transferId: undefined
      })
      
      toast.error('Failed to add player to transfer market. Please try again.')
    }
  })

  // Remove from transfer market mutation
  const removeFromTransferMarketMutation = useMutation({
    mutationFn: async ({ transferId }: RemoveFromMarketMutationData) => {
      await removePlayerFromTransferMarketService(transferId)
      return { transferId }
    },
    onMutate: async ({ playerId, transferId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TEAM })
      
      // Store previous state for rollback
      const previousPlayer = team?.players.find(p => p.id === playerId)
      
      // Optimistically update the player
      updatePlayer(playerId, {
        isInTransferMarket: false,
        askingPrice: undefined,
        transferId: undefined
      })
      
      // Return context for rollback
      return { playerId, transferId, previousPlayer }
    },
    onSuccess: ({ transferId }) => {
      toast.success('Player removed from transfer market')
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFER_MARKET })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM })
    },
    onError: (error, { playerId, transferId }, context) => {
      console.error('Failed to remove player from transfer market:', error)
      
      // Rollback optimistic update
      if (context?.previousPlayer) {
        updatePlayer(playerId, {
          isInTransferMarket: context.previousPlayer.isInTransferMarket,
          askingPrice: context.previousPlayer.askingPrice,
          transferId: context.previousPlayer.transferId
        })
      }
      
      toast.error('Failed to remove player from transfer market. Please try again.')
    }
  })

  // Sell player mutation (placeholder - replace with actual service)
  const sellPlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      // Replace with actual sell player service
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true })
        }, 1000)
      })
    },
    onMutate: async (playerId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TEAM })
      
      return { playerId }
    },
    onSuccess: (_, playerId) => {
      toast.success('Player sold successfully')
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAM })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLAYERS })
    },
    onError: (error, playerId) => {
      console.error('Failed to sell player:', error)
      toast.error('Failed to sell player. Please try again.')
    }
  })

  useEffect(() => {
    if (team?.players) {
      setFilteredPlayers(team.players)
    }
  }, [team])

  const getPriceRange = () => {
    if (!team?.players || team.players.length === 0) return { min: 0, max: 1000000 }
    
    const prices = team.players.map(player => player.value || 0)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  const priceRange = getPriceRange()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('playerName', term)
    } else {
      params.delete('playerName')
    }
    replace(`${pathname}?${params.toString()}`)
    
    // Apply search filter
    applyFilters(term, getCurrentFilters())
  }, 500)

  const getCurrentFilters = () => {
    // Get current filters from state or URL params
    return {} // You can implement this based on your needs
  }

  const applyFilters = (searchTerm: string, filters: Record<string, any>) => {
    if (!team?.players) return

    let filtered = team.players

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((player) => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply price filter
    if (filters.price && Array.isArray(filters.price)) {
      const [minPrice, maxPrice] = filters.price
      filtered = filtered.filter((player) => {
        const playerPrice = player.value || 0
        return playerPrice >= minPrice && playerPrice <= maxPrice
      })
    }

    // Apply position filter
    if (filters.position && filters.position !== "") {
      filtered = filtered.filter((player) => player.position === filters.position)
    }

    setFilteredPlayers(filtered)
  }

  const handleFilter = (filters: Record<string, any>) => {
    const currentSearchTerm = searchParams.get('playerName') || ''
    applyFilters(currentSearchTerm, filters)
  }

  const handleAddToTransferMarket = async (playerId: string, askingPrice: number) => {
    addToTransferMarketMutation.mutate({ playerId, askingPrice })
  }

  const handleRemoveFromTransferMarket = async (playerId: string) => {
    const player = team?.players.find(p => p.id === playerId)
    if (!player?.transferId) {
      toast.error('Transfer ID not found for player')
      return
    }
    
    removeFromTransferMarketMutation.mutate({ 
      playerId, 
      transferId: player.transferId 
    })
  }

  const handleSellPlayer = async (playerId: string) => {
    sellPlayerMutation.mutate(playerId)
  }

  const getPlayerLoadingState = (playerId: string) => {
    return (
      addToTransferMarketMutation.isPending && 
      addToTransferMarketMutation.variables?.playerId === playerId
    ) || (
      removeFromTransferMarketMutation.isPending && 
      removeFromTransferMarketMutation.variables?.playerId === playerId
    ) || (
      sellPlayerMutation.isPending && 
      sellPlayerMutation.variables === playerId
    )
  }

  const ListingTab = (players: Player[], position: "ALL" | "GK" | 'DEF' | 'MID' | 'FWD') => {
    let positionFiltered: Player[] | undefined = position != "ALL" ? players.filter((player) => player.position == position) : players
    return (
      <>
        {positionFiltered && positionFiltered.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            variant="owned"
            onSell={handleSellPlayer}
            onAddToTransferList={handleAddToTransferMarket}
            onRemoveFromTransferList={handleRemoveFromTransferMarket}
            isLoading={getPlayerLoadingState(player.id)}
          />
        ))}
      </>
    )
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="display" className="text-slate-900">
            My Team
          </Typography>
          <Typography variant="body" color="secondary">
            {team.playerCount} players • $ {team.totalValue.toLocaleString()} total value
          </Typography>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        placeholder="Search your players..."
        filters={[
          {
            key: "price",
            label: "Price Range",
            type: "slider",
            min: priceRange.min,
            max: priceRange.max,
            step: 1000,
            defaultValue: [priceRange.min, priceRange.max]
          },
          {
            key: "position",
            label: "Position",
            type: "select",
            options: ["GK", "DEF", "MID", "FWD"]
          }
        ]}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {/* Position Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Players</TabsTrigger>
          <TabsTrigger value="gk">
            <Target className="w-4 h-4 mr-1" />
            GK ({filteredPlayers.filter((p) => p.position === "GK").length})
          </TabsTrigger>
          <TabsTrigger value="def">
            <Shield className="w-4 h-4 mr-1" />
            DEF ({filteredPlayers.filter((p) => p.position === "DEF").length})
          </TabsTrigger>
          <TabsTrigger value="mid">
            <Zap className="w-4 h-4 mr-1" />
            MID ({filteredPlayers.filter((p) => p.position === "MID").length})
          </TabsTrigger>
          <TabsTrigger value="fwd">
            <Trophy className="w-4 h-4 mr-1" />
            FWD ({filteredPlayers.filter((p) => p.position === "FWD").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {ListingTab(filteredPlayers, "ALL")}
        </TabsContent>

        <TabsContent value="gk" className="space-y-4">
          {ListingTab(filteredPlayers, "GK")}
        </TabsContent>

        <TabsContent value="def" className="space-y-4">
          {ListingTab(filteredPlayers, "DEF")}
        </TabsContent>

        <TabsContent value="mid" className="space-y-4">
          {ListingTab(filteredPlayers, "MID")}
        </TabsContent>

        <TabsContent value="fwd" className="space-y-4">
          {ListingTab(filteredPlayers, "FWD")}
        </TabsContent>
      </Tabs>
    </div>
  )
}