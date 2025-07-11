"use client"
import { Typography } from "@/components/atoms/Typography"
import { Trophy } from "lucide-react"
import { AuthForm } from "@/components/forms/AuthForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function AuthPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <Typography variant="display" className="text-slate-900 mb-2">
              Football Manager Pro
            </Typography>
            <Typography variant="body" color="secondary">
              Build your championship team
            </Typography>
          </div>
          <AuthForm />
          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Trophy, label: "Manage Teams", color: "bg-green-100 text-green-600" },
              { icon: Trophy, label: "Buy Players", color: "bg-blue-100 text-blue-600" },
              { icon: Trophy, label: "Win Trophies", color: "bg-yellow-100 text-yellow-600" },
            ].map((feature, index) => (
              <div key={index} className="p-3">
                <div className={`w-8 h-8 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <Typography variant="caption" color="secondary">
                  {feature.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}
