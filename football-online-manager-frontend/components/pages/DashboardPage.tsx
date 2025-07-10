import { Typography } from "@/components/atoms/Typography"
import { StatCard } from "@/components/molecules/StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, TrendingUp, Trophy, Plus } from "lucide-react"

export function DashboardPage() {
  const stats = [
    {
      title: "Team Value",
      value: "$45.2M",
      icon: TrendingUp,
      trend: { value: 12.5, label: "from last month", direction: "up" as const },
      color: "green" as const,
    },
    {
      title: "Available Budget",
      value: "$3.25M",
      icon: DollarSign,
      color: "blue" as const,
    },
    {
      title: "Squad Size",
      value: "22/25",
      icon: Users,
      color: "yellow" as const,
    },
    {
      title: "League Position",
      value: "#3",
      icon: Trophy,
      trend: { value: 2, label: "positions up", direction: "up" as const },
      color: "purple" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="display" className="text-slate-900">
            Team Dashboard
          </Typography>
          <Typography variant="body" color="secondary">
            Manage your championship-winning squad
          </Typography>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Formation Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Formation - 4-3-3</CardTitle>
          <CardDescription>Your starting XI for the next match</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="bg-green-500 rounded-lg p-6 relative min-h-[300px] flex items-center justify-center"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 35px,
                rgba(255,255,255,0.1) 35px,
                rgba(255,255,255,0.1) 37px
              )`,
            }}
          >
            <div className="text-center text-white">
              <Typography variant="h2" className="text-white mb-2">
                Interactive Formation View
              </Typography>
              <Typography variant="body" className="text-white/80">
                Drag and drop players to adjust positions
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
