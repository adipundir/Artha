"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Coins } from "lucide-react"
import { useActiveWallet } from "thirdweb/react"
import { getContract } from "thirdweb"
import { client } from "./ConnectButton"
import { mantleSepolia } from "@/config/chains"
import { Skeleton } from "@/components/ui/skeleton"

// Placeholder for contract address - to be replaced with actual deployed contract
const INVESTMENT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

// Initial profit data with a placeholder for MNT
const initialProfitData = [
  {
    token: "MNT",
    netProfit: 0,
    currentValue: 0,
    stablecoinBalance: 0,
    status: "Tracking",
  },
  {
    token: "USDC",
    netProfit: 0,
    currentValue: 0,
    stablecoinBalance: 0,
    status: "Stablecoin",
  },
]

// Initial daily profit chart data
const initialDailyProfitData = [
  { name: "Mon", profit: 0 },
  { name: "Tue", profit: 0 },
  { name: "Wed", profit: 0 },
  { name: "Thu", profit: 0 },
  { name: "Fri", profit: 0 },
  { name: "Sat", profit: 0 },
  { name: "Sun", profit: 0 },
]

export function ProfitTracker() {
  const activeWallet = useActiveWallet()
  const [walletAddress, setWalletAddress] = useState("")
  
  // Get wallet address when active wallet changes
  useEffect(() => {
    if (activeWallet) {
      try {
        const address = activeWallet?.getAccount()?.address || ""
        setWalletAddress(address)
      } catch (error) {
        console.error("Error getting wallet address:", error)
      }
    }
  }, [activeWallet])
  
  const [isLoading, setIsLoading] = useState(true)
  const [profitData, setProfitData] = useState(initialProfitData)
  const [dailyProfitData, setDailyProfitData] = useState(initialDailyProfitData)
  const [totalProfit, setTotalProfit] = useState(0)
  
  // This will be replaced with actual fetching from the contract once deployed
  useEffect(() => {
    async function fetchProfitData() {
      if (!walletAddress) return
      
      // Simulating data loading
      setIsLoading(true)
      
      try {
        // This is where we'll fetch real data once the contract is deployed
        // For now, simulate with some random data
        setTimeout(() => {
          // Mock data - will be replaced with contract calls
          const mockMntProfit = Math.random() * 20 - 5
          const mockMntValue = 450 + (Math.random() * 50 - 25)
          const mockUsdcBalance = 200 + Math.random() * 50
          
          const updatedProfitData = [
            {
              token: "MNT",
              netProfit: mockMntProfit,
              currentValue: mockMntValue,
              stablecoinBalance: 0,
              status: "Tracking",
            },
            {
              token: "USDC",
              netProfit: 0,
              currentValue: mockUsdcBalance,
              stablecoinBalance: mockUsdcBalance,
              status: "Stablecoin",
            },
          ]
          
          const updatedDailyProfitData = initialDailyProfitData.map(day => ({
            ...day,
            profit: Math.random() * 10 - 3,
          }))
          
          setProfitData(updatedProfitData)
          setDailyProfitData(updatedDailyProfitData)
          setTotalProfit(mockMntProfit)
          setIsLoading(false)
        }, 1500)
        
        /* 
        // Example of how the actual contract interaction will work
        const contract = getContract({
          address: INVESTMENT_CONTRACT_ADDRESS,
          chain: mantleSepolia,
          client,
        })
        
        // These will be actual contract calls once deployed
        const investorDetails = await contract.call("investors", [walletAddress])
        const poolValue = await contract.call("totalPoolValue")
        
        // Update state with actual data
        const investorProfit = calculateProfit(investorDetails, poolValue)
        const updatedProfitData = [...]
        setProfitData(updatedProfitData)
        */
        
      } catch (error) {
        console.error("Error fetching profit data:", error)
        setIsLoading(false)
      }
    }
    
    fetchProfitData()
  }, [walletAddress])

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
            {isLoading ? (
              <Skeleton className="h-8 w-36" />
            ) : (
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toFixed(2)} USD
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Daily Profit (Last 7 Days)</div>
            {isLoading ? (
              <Skeleton className="h-[150px] w-full" />
            ) : (
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
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Token Profits</div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[80px] w-full" />
                <Skeleton className="h-[80px] w-full" />
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
