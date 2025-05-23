import { WhaleTracker } from "@/components/whale-tracker"
import TradingSignal from "../../components/trading-signal"
import Investments from "../../components/investments"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Investments (full width) */}
        <div className="mb-6">
          <Investments />
        </div>
        
        {/* Trading Signal (full width) */}
        <div className="mb-6">
          <TradingSignal />
        </div>
        
        {/* Whale Tracker (full width) */}
        <div>
          <WhaleTracker />
        </div>
      </main>
    </div>
  )
} 