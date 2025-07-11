import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Typography } from "@/components/atoms/Typography"
import { StatusBadge } from "@/components/atoms/StatusBadge"
import { IconButton } from "@/components/atoms/IconButton"
import { Trophy, DollarSign, Menu, LogOut } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { LogoutService } from "@/services/auth.service"
import { AxiosError } from "axios"
import { toast } from "sonner"
import clearStorages from "@/lib/clearStorages"

interface User {
  email: string | null
  initials: string
  budget: number | string
}

interface AppHeaderProps {
  user: User
  onMenuToggle?: () => void
}

export function AppHeader({ user, onMenuToggle }: AppHeaderProps) {
  const logoutMutation = useMutation({
    mutationFn: LogoutService,
    onSuccess: () => {
      clearStorages()
      window.location.href = "/"
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data.message ?? "An unexpected error occurred";
      toast(message);
    },
  });
  const onClickLogout = ()=>{
    logoutMutation.mutate()
  }

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Brand & Menu */}
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <IconButton
                icon={Menu}
                variant="ghost"
                onClick={onMenuToggle}
                aria-label="Toggle menu"
                className="text-white hover:bg-slate-800 md:hidden"
              />
            )}

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <Typography variant="h2" className="text-white">
                  Football Manager Pro
                </Typography>
                <Typography variant="caption" className="text-slate-300">
                  Build Your Championship Team
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Budget Display */}
            <StatusBadge status="success" className="bg-green-500/10 text-green-400 border-green-500 hidden sm:flex">
              <DollarSign className="w-4 h-4 mr-1" />{user.budget.toLocaleString()}
            </StatusBadge>



            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <Typography variant="body" className="text-white text-sm">
                  {user.email}
                </Typography>
              </div>
              <Avatar>
                <AvatarFallback className="bg-green-500 text-white">{user.initials}</AvatarFallback>
              </Avatar>
            </div>

            {/* Logout */}
            <IconButton
              icon={LogOut}
              variant="ghost"
              onClick={onClickLogout}
              aria-label="Logout"
              className="text-white hover:bg-slate-800 hidden sm:flex"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
