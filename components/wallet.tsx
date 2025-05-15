"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, ExternalLink, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActiveWallet, useWalletBalance } from "thirdweb/react"
import { useEffect, useState } from "react"
import { client } from "./ConnectButton"
import { mantleSepolia } from "@/config/chains"
import { Skeleton } from "./ui/skeleton"


export function Wallet() {
  const activeWallet = useActiveWallet()
  const [walletAddress, setWalletAddress] = useState("")
  const [shortAddress, setShortAddress] = useState("")
  const [mntPriceInUSD, setMntPriceInUSD] = useState(0)
  const [isPriceFetching, setIsPriceFetching] = useState(true)
  const [isWalletReady, setIsWalletReady] = useState(false)
  // Demo investment state
  const [mntInvestment, setMntInvestment] = useState(25)
  
  useEffect(() => {
    if (activeWallet) {
      try {
        const address = activeWallet?.getAccount()?.address || ""
        setWalletAddress(address)
        if (address) {
          setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
          setIsWalletReady(true)
        } else {
          setIsWalletReady(false)
        }
      } catch (error) {
        console.error("Error getting wallet address:", error)
        setIsWalletReady(false)
      }
    } else {
      setIsWalletReady(false)
    }
  }, [activeWallet])
  
  // Fetch MNT price from CoinGecko
  useEffect(() => {
    const fetchMntPrice = async () => {
      try {
        setIsPriceFetching(true)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd')
        const data = await response.json()
        if (data.mantle && data.mantle.usd) {
          setMntPriceInUSD(data.mantle.usd)
        } else {
          console.error("Failed to get MNT price from API")
          setMntPriceInUSD(0.45) // Fallback value if API fails
        }
      } catch (error) {
        console.error("Error fetching MNT price:", error)
        setMntPriceInUSD(0.45) // Fallback value if API fails
      } finally {
        setIsPriceFetching(false)
      }
    }

    fetchMntPrice()
    
    // Refresh price every 5 minutes
    const intervalId = setInterval(fetchMntPrice, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [])
  
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({
    address: walletAddress || "",
    chain: mantleSepolia,
    client,
  })
  
  const [displayValue, setDisplayValue] = useState("0")
  const [displaySymbol, setDisplaySymbol] = useState("MNT")
  
  useEffect(() => {
    if (balanceData) {
      setDisplayValue(parseFloat(balanceData.displayValue).toFixed(4))
      setDisplaySymbol(balanceData.symbol)
    }
  }, [balanceData])

  const usdValue = balanceData ? parseFloat(balanceData.displayValue) * mntPriceInUSD : 0
  
  // Demo investment value in USDC
  const investmentUsdValue = mntInvestment * mntPriceInUSD
  
  // Simulating an LP investment
  const handleInvestInLP = () => {
    setMntInvestment(prevValue => prevValue + 5)
  }
  
  // Determine if we should show loading state
  const isLoading = !isWalletReady || isBalanceLoading || isPriceFetching

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Wallet Overview</CardTitle>
          <CardDescription>
            {isWalletReady ? (
              <>
                Connected: {shortAddress}
                {walletAddress && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-4 p-0 ml-1"
                    onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${walletAddress}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </>
            ) : (
              <Skeleton className="h-4 w-36" />
            )}
          </CardDescription>
        </div>
        <WalletIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Investment in LP section - moved to top and made larger */}
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="text-base font-semibold">Your Investment</div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8"
                onClick={handleInvestInLP}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Invest Funds
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">MNT Invested</div>
                <div className="text-2xl font-bold">{mntInvestment.toFixed(2)} MNT</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">USDC Value</div>
                <div className="text-2xl font-bold">${investmentUsdValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* Balance section with matching padding */}
          <div className="bg-background p-4 rounded-lg border">
            <div className="mb-3">
              <div className="text-base font-semibold mb-3">Wallet Balance</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">MNT Balance</div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <div className="text-lg font-medium">{displayValue} {displaySymbol}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">USD Value</div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <div className="text-lg font-medium">${usdValue.toFixed(2)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
