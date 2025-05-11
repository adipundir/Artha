import { Wallet } from "@/components/wallet"
import { DashboardHeader } from "@/components/dashboard-header"
import { TokenTracker } from "@/components/token-tracker"
import { ActivityFeed } from "@/components/activity-feed"
import { ProfitTracker } from "@/components/profit-tracker"
import { OverallStats } from "@/components/overall-stats"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Wallet />
          <OverallStats />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenTracker />
            <ActivityFeed />
          </div>
          <div className="lg:col-span-1">
            <ProfitTracker />
          </div>
        </div>
      </main>
    </div>
  )
} 