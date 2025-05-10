"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Wallet() {
  // Mock data for wallet tokens
  const walletAddress = "0x1a2...3b4c"

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Wallet Overview</CardTitle>
          <CardDescription>
            Connected: {walletAddress}
            <Button variant="link" size="sm" className="h-4 p-0 ml-1">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </CardDescription>
        </div>
        <WalletIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Balance</div>
          <div className="text-2xl font-bold">$12,345.67</div>
        </div>
      </CardContent>
    </Card>
  )
}
