"use client"

import { useState } from "react"
import { Typography } from "@/components/atoms/Typography"
import { PlayerCard, type Player } from "@/components/molecules/PlayerCard"
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter, Plus, Target, Shield, Zap, Trophy } from "lucide-react"

export function TeamPage() {
  const [players] = useState<Player[]>([
    { id: "1", name: "Marcus Silva", position: "ST", rating: 87, value: "$2.1M", team: "Your Team", isOwned: true },
    { id: "2", name: "David Chen", position: "CM", rating: 84, value: "$1.8M", team: "Your Team", isOwned: true },
    { id: "3", name: "Alex Rodriguez", position: "CB", rating: 82, value: "$1.5M", team: "Your Team", isOwned: true },
  ])

  const filterOptions = [
    { key: "position", label: "Position", options: ["GK", "DEF", "MID", "ATT"] },
    { key: "rating", label: "Rating", options: ["80+", "75-79", "70-74", "Below 70"] },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="display" className="text-slate-900">
            My Squad
          </Typography>
          <Typography variant="body" color="secondary">
            22 players • $45.2M total value
          </Typography>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        placeholder="Search your players..."
        filters={filterOptions}
        onSearch={(query) => console.log("Search:", query)}
        onFilter={(filters) => console.log("Filters:", filters)}
      />

      {/* Position Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Players</TabsTrigger>
          <TabsTrigger value="gk">
            <Target className="w-4 h-4 mr-1" />
            GK (3)
          </TabsTrigger>
          <TabsTrigger value="def">
            <Shield className="w-4 h-4 mr-1" />
            DEF (6)
          </TabsTrigger>
          <TabsTrigger value="mid">
            <Zap className="w-4 h-4 mr-1" />
            MID (8)
          </TabsTrigger>
          <TabsTrigger value="att">
            <Trophy className="w-4 h-4 mr-1" />
            ATT (5)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Player Cards */}
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              variant="owned"
              onSell={(id) => console.log("Sell player:", id)}
              onAddToTransferList={(id) => console.log("Add to transfer list:", id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="gk" className="space-y-4">
          <Typography variant="body" color="secondary" className="text-center py-8">
            Goalkeeper players will be displayed here
          </Typography>
        </TabsContent>

        <TabsContent value="def" className="space-y-4">
          <Typography variant="body" color="secondary" className="text-center py-8">
            Defender players will be displayed here
          </Typography>
        </TabsContent>

        <TabsContent value="mid" className="space-y-4">
          <Typography variant="body" color="secondary" className="text-center py-8">
            Midfielder players will be displayed here
          </Typography>
        </TabsContent>

        <TabsContent value="att" className="space-y-4">
          <Typography variant="body" color="secondary" className="text-center py-8">
            Attacker players will be displayed here
          </Typography>
        </TabsContent>
      </Tabs>
    </div>
  )
}
