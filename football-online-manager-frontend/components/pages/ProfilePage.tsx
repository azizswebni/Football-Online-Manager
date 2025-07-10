import { Typography } from "@/components/atoms/Typography"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Trophy } from "lucide-react"

export function ProfilePage() {
  const achievements = [
    {
      title: "Transfer Master",
      description: "Completed 10 successful transfers",
      date: "2 days ago",
      icon: DollarSign,
    },
    {
      title: "Squad Builder",
      description: "Built a team worth over $40M",
      date: "1 week ago",
      icon: Users,
    },
    {
      title: "Rising Star",
      description: "Reached Level 12",
      date: "2 weeks ago",
      icon: Trophy,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="display" className="text-slate-900">
            Manager Profile
          </Typography>
          <Typography variant="body" color="secondary">
            Your journey to football greatness
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-green-500 text-white text-2xl">JD</AvatarFallback>
            </Avatar>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Elite Manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Typography variant="h2" className="text-green-600">
                Level 12
              </Typography>
              <Progress value={75} className="mt-2" />
              <Typography variant="caption" color="secondary" className="mt-1 block">
                2,250 / 3,000 XP
              </Typography>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography variant="body" color="secondary">
                  Teams Managed:
                </Typography>
                <Typography variant="body" weight="semibold">
                  3
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body" color="secondary">
                  Trophies Won:
                </Typography>
                <Typography variant="body" weight="semibold">
                  7
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body" color="secondary">
                  Success Rate:
                </Typography>
                <Typography variant="body" weight="semibold" className="text-green-600">
                  78%
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <achievement.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Typography variant="h4" className="text-slate-900">
                    {achievement.title}
                  </Typography>
                  <Typography variant="body" color="secondary">
                    {achievement.description}
                  </Typography>
                </div>
                <Typography variant="caption" color="secondary">
                  {achievement.date}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
