"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChartIcon as ChartLineUp, Play, Pause, TrendingUp, TrendingDown } from "lucide-react"
import { TokenSparkline } from "./token-sparkline"

// Mock data for tokens
const tokens = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    balance: 1.25,
    value: 3750.25,
    price: 3000.2,
    change: 2.5,
    isTracking: true,
    data: [2800, 2950, 3100, 3050, 2900, 3000, 3200],
  },
  {
    id: 2,
    name: "Mantle",
    symbol: "MNT",
    balance: 1000,
    value: 450.0,
    price: 0.45,
    change: -1.2,
    isTracking: false,
    data: [0.48, 0.47, 0.46, 0.44, 0.43, 0.45, 0.45],
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    balance: 500,
    value: 500.0,
    price: 1.0,
    change: 0.01,
    isTracking: false,
    data: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 4,
    name: "Arbitrum",
    symbol: "ARB",
    balance: 200,
    value: 240.0,
    price: 1.2,
    change: 5.3,
    isTracking: true,
    data: [1.1, 1.15, 1.12, 1.18, 1.22, 1.19, 1.2],
  },
]

export function TokenTracker() {
  const [trackedTokens, setTrackedTokens] = useState(tokens.map((token) => ({ ...token })))

  const toggleTracking = (id: number) => {
    setTrackedTokens(
      trackedTokens.map((token) => (token.id === id ? { ...token, isTracking: !token.isTracking } : token)),
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Coin Tracker</CardTitle>
        <ChartLineUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden md:table-cell">24h</TableHead>
              <TableHead className="hidden lg:table-cell">Chart</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trackedTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{token.name}</span>
                    <span className="text-xs text-muted-foreground">{token.symbol}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">${token.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{token.balance.toFixed(token.symbol === "ETH" ? 4 : 2)}</TableCell>
                <TableCell className="text-right">${token.value.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className={`flex items-center ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{token.change}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell w-[120px]">
                  <TokenSparkline data={token.data} change={token.change} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {token.isTracking && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Tracking
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toggleTracking(token.id)}>
                      {token.isTracking ? (
                        <Pause className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Play className="h-3.5 w-3.5 mr-1" />
                      )}
                      {token.isTracking ? "Stop" : "Track"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
