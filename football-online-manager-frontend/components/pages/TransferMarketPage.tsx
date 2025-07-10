"use client"

import { useState } from "react"
import { Typography } from "@/components/atoms/Typography"
import { PlayerCard, type Player } from "@/components/molecules/PlayerCard"
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { DollarSign } from "lucide-react"

export function TransferMarketPage() {
  const [marketPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Roberto Martinez",
      position: "LW",
      rating: 89,
      value: "$2.8M",
      askingPrice: "$2.95M",
      team: "FC Barcelona",
      isOwned: false,
    },
    {
      id: "2",
      name: "James Wilson",
      position: "CDM",
      rating: 85,
      value: "$1.9M",
      askingPrice: "$2.0M",
      team: "Manchester City",
      isOwned: false,
    },
    {
      id: "3",
      name: "Luis Garcia",
      position: "GK",
      rating: 83,
      value: "$1.2M",
      askingPrice: "$1.3M",
      team: "Real Madrid",
      isOwned: false,
    },
  ])

  const filterOptions = [
    { key: "position", label: "Position", options: ["GK", "DEF", "MID", "ATT"] },
    { key: "team", label: "Team", options: ["FC Barcelona", "Manchester City", "Real Madrid"] },
    { key: "price", label: "Price Range", options: ["Under $1M", "$1M-$2M", "$2M-$3M", "Over $3M"] },
  ]

  const calculateBuyPrice = (askingPrice: string) => {
    const price = Number.parseFloat(askingPrice.replace("$", "").replace("M", ""))
    return (price * 0.95).toFixed(2)
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
        <StatusBadge status="success" className="bg-green-50 text-green-700 border-green-200">
          <DollarSign className="w-4 h-4 mr-1" />
          Budget: $3,250,000
        </StatusBadge>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        placeholder="Search players, teams, or positions..."
        filters={filterOptions}
        onSearch={(query) => console.log("Search:", query)}
        onFilter={(filters) => console.log("Filters:", filters)}
      />

      {/* Available Players */}
      <div className="space-y-4">
        <Typography variant="h3" className="text-slate-900">
          Available Players
        </Typography>

        {marketPlayers.map((player) => (
          <div key={player.id} className="relative">
            <PlayerCard player={player} variant="market" onBuy={(id) => console.log("Buy player:", id)} />
            {player.askingPrice && (
              <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-md p-2">
                <Typography variant="caption" className="text-blue-700">
                  You pay: ${calculateBuyPrice(player.askingPrice)}M (95%)
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
