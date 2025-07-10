"use client"

import { useState } from "react"
import { AppHeader } from "@/components/AppHeader"
import { AppNavigation } from "@/components/AppNavigation"
import { DashboardPage as DashboardPageComponent } from "@/components/pages/DashboardPage"
import { TeamPage } from "@/components/pages/TeamPage"
import { TransferMarketPage } from "@/components/pages/TransferMarketPage"
import { ProfilePage } from "@/components/pages/ProfilePage"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const user = {
    name: "John Doe",
    initials: "JD",
    budget: 3250000,
    level: 12,
  }

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPageComponent />
      case "team":
        return <TeamPage />
      case "transfers":
        return <TransferMarketPage />
      case "profile":
        return <ProfilePage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex flex-col">
      <AppHeader
        user={user}
        onMenuToggle={() => console.log("Menu toggled")}
        onNotifications={() => console.log("Notifications opened")}
        onSettings={() => console.log("Settings opened")}
      />

      <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{renderPage()}</div>
      </main>

    </div>
  )
}
