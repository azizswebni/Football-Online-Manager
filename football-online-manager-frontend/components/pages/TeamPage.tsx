"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/atoms/Typography"
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Shield, Zap, Trophy } from "lucide-react"
import { useTeamStore } from "@/store/team.store"
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Player } from "@/lib/interfaces"
import { PlayerCard } from "../molecules/PlayerCard"

// Fake mutations - replace with real API calls later
const useMutations = () => {
  const addToTransferMarket = async (playerId: string, askingPrice: number) => {
    console.log(`Adding player ${playerId} to transfer market with asking price: $${askingPrice}`);
    // Fake API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const removeFromTransferMarket = async (playerId: string) => {
    console.log(`Removing player ${playerId} from transfer market`);
    // Fake API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const sellPlayer = async (playerId: string) => {
    console.log(`Selling player ${playerId}`);
    // Fake API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  return {
    addToTransferMarket,
    removeFromTransferMarket,
    sellPlayer
  };
};

export function TeamPage() {
  const { team, updatePlayer } = useTeamStore()
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState<Set<string>>(new Set());
  
  const mutations = useMutations();

  useEffect(() => {
    if (team?.players) {
      setFilteredPlayers(team.players);
    }
  }, [team]);

  const searchParams = useSearchParams();

  const getPriceRange = () => {
    if (!team?.players || team.players.length === 0) return { min: 0, max: 1000000 }
    
    const prices = team.players.map(player => player.value || 0)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  const priceRange = getPriceRange()

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('playerName', term);
    } else {
      params.delete('playerName');
    }
    replace(`${pathname}?${params.toString()}`);
    
    // Apply search filter
    applyFilters(term, getCurrentFilters());
  }, 500);

  const getCurrentFilters = () => {
    // Get current filters from state or URL params
    return {}; // You can implement this based on your needs
  }

  const applyFilters = (searchTerm: string, filters: Record<string, any>) => {
    if (!team?.players) return;

    let filtered = team.players;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((player) => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    if (filters.price && Array.isArray(filters.price)) {
      const [minPrice, maxPrice] = filters.price;
      filtered = filtered.filter((player) => {
        const playerPrice = player.value || 0;
        return playerPrice >= minPrice && playerPrice <= maxPrice;
      });
    }

    // Apply position filter
    if (filters.position && filters.position !== "") {
      filtered = filtered.filter((player) => player.position === filters.position);
    }

    setFilteredPlayers(filtered);
  }

  const handleFilter = (filters: Record<string, any>) => {
    const currentSearchTerm = searchParams.get('playerName') || '';
    applyFilters(currentSearchTerm, filters);
  }

  const handleAddToTransferMarket = async (playerId: string, askingPrice: number) => {
    setLoadingPlayers(prev => new Set(prev).add(playerId));
    
    try {
      await mutations.addToTransferMarket(playerId, askingPrice);
      
      // Update player in store
      updatePlayer(playerId, {
        isInTransferMarket: true,
        askingPrice: askingPrice,
        transferId: `transfer_${playerId}_${Date.now()}`
      });
      
      console.log(`Player ${playerId} added to transfer market with asking price: $${askingPrice}`);
    } catch (error) {
      console.error('Failed to add player to transfer market:', error);
    } finally {
      setLoadingPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  const handleRemoveFromTransferMarket = async (playerId: string) => {
    setLoadingPlayers(prev => new Set(prev).add(playerId));
    
    try {
      await mutations.removeFromTransferMarket(playerId);
      
      // Update player in store
      updatePlayer(playerId, {
        isInTransferMarket: false,
        askingPrice: undefined,
        transferId: undefined
      });
      
      console.log(`Player ${playerId} removed from transfer market`);
    } catch (error) {
      console.error('Failed to remove player from transfer market:', error);
    } finally {
      setLoadingPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  const handleSellPlayer = async (playerId: string) => {
    setLoadingPlayers(prev => new Set(prev).add(playerId));
    
    try {
      await mutations.sellPlayer(playerId);
      console.log(`Player ${playerId} sold`);
    } catch (error) {
      console.error('Failed to sell player:', error);
    } finally {
      setLoadingPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  const ListingTab = (players: Player[], position: "ALL" | "GK" | 'DEF' | 'MID' | 'FWD') => {
    let positionFiltered: Player[] | undefined = position != "ALL" ? players.filter((player) => player.position == position) : players
    return <>
      {positionFiltered && positionFiltered.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          variant="owned"
          onSell={handleSellPlayer}
          onAddToTransferList={handleAddToTransferMarket}
          onRemoveFromTransferList={handleRemoveFromTransferMarket}
          isLoading={loadingPlayers.has(player.id)}
        />
      ))}
    </>
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