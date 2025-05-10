"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function OverallStats() {
  // Mock data
  const dailyReturn = 2.3
  const weeklyReturn = -1.5
  const monthlyReturn = 8.7

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Overall Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Daily</span>
            <div className={`flex items-center ${dailyReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
              {dailyReturn >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">{dailyReturn}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Weekly</span>
            <div className={`flex items-center ${weeklyReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
              {weeklyReturn >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">{weeklyReturn}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Monthly</span>
            <div className={`flex items-center ${monthlyReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
              {monthlyReturn >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">{monthlyReturn}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
