"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Coins } from "lucide-react"

// Mock data for profit tracking
const profitData = [
  {
    token: "ETH",
    netProfit: 125.5,
    currentValue: 3750.25,
    stablecoinBalance: 500.0,
    status: "Tracking",
  },
  {
    token: "MNT",
    netProfit: -15.2,
    currentValue: 450.0,
    stablecoinBalance: 200.0,
    status: "Tracking",
  },
  {
    token: "ARB",
    netProfit: 45.75,
    currentValue: 240.0,
    stablecoinBalance: 0,
    status: "Idle",
  },
  {
    token: "USDC",
    netProfit: 0,
    currentValue: 500.0,
    stablecoinBalance: 500.0,
    status: "Stablecoin",
  },
]

// Mock data for daily profit chart
const dailyProfitData = [
  { name: "Mon", profit: 12.5 },
  { name: "Tue", profit: -5.2 },
  { name: "Wed", profit: 8.7 },
  { name: "Thu", profit: 15.3 },
  { name: "Fri", profit: -3.1 },
  { name: "Sat", profit: 7.8 },
  { name: "Sun", profit: 10.2 },
]

export function ProfitTracker() {
  const totalProfit = profitData.reduce((sum, item) => sum + item.netProfit, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Profit Tracker</CardTitle>
        <Coins className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Net Profit</div>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toFixed(2)} USD
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Daily Profit (Last 7 Days)</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={dailyProfitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey="profit"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Token Profits</div>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {profitData.map((item) => (
                  <div key={item.token} className="border-b pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{item.token}</div>
                      <Badge
                        variant={
                          item.status === "Tracking"
                            ? "default"
                            : item.status === "Stablecoin"
                              ? "outline"
                              : "secondary"
                        }
                        className={item.status === "Tracking" ? "bg-green-500" : ""}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Net Profit</div>
                        <div className={item.netProfit >= 0 ? "text-green-500" : "text-red-500"}>
                          {item.netProfit >= 0 ? "+" : ""}
                          {item.netProfit.toFixed(2)} USD
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current Value</div>
                        <div>${item.currentValue.toFixed(2)}</div>
                      </div>
                      {item.stablecoinBalance > 0 && (
                        <div className="col-span-2">
                          <div className="text-muted-foreground">Stablecoin Balance</div>
                          <div>${item.stablecoinBalance.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
