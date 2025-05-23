"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, FishSymbol } from "lucide-react"
import { getTopMntHolders } from "@/app/actions"

// Type for whale data
type WhaleData = {
  id?: number
  address: string
  shortAddress: string
  mntBalance: number
  usdValue: number
  lastActivity: string
  is_contract?: boolean
  name?: string | null
}

export function WhaleTracker() {
  const [whales, setWhales] = useState<WhaleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getTopMntHolders()
        
        // Add an id if it doesn't exist
        const processedData = data.map((whale: WhaleData, index: number) => {
          // Only add id if it doesn't already exist
          if (whale.id === undefined) {
            return { ...whale, id: index + 1 }
          }
          return whale
        })
        
        // Sort by WMNT balance in descending order
        const sortedData = processedData.sort((a: WhaleData, b: WhaleData) => b.mntBalance - a.mntBalance)
        
        setWhales(sortedData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch whale data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Function to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K'
    }
    return num.toString()
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">WMNT Whale Tracker</CardTitle>
        <FishSymbol className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/4" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet Address</TableHead>
                <TableHead className="text-right">WMNT Balance</TableHead>
                <TableHead className="text-right">USD Value</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whales.map((whale) => (
                <TableRow key={whale.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="hidden md:inline">{whale.address}</span>
                      <span className="md:hidden">{whale.shortAddress}</span>
                      <a 
                        href={`https://explorer.mantle.xyz/address/${whale.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(whale.mntBalance)} WMNT
                  </TableCell>
                  <TableCell className="text-right">
                    ${formatNumber(whale.usdValue)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {whale.is_contract ? (whale.name || 'Contract') : 'Wallet'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 