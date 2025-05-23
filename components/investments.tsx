'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveWallet, useWalletBalance } from "thirdweb/react";
import { mantleSepolia } from "@/config/chains";
import { client } from "@/components/ConnectButton";
import { parseEther } from "ethers";
import { Loader2, ArrowRightIcon, WalletIcon, RefreshCw } from "lucide-react";
import { ethers } from 'ethers';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getUserInvestmentInfo, 
  getTotalShares, 
  getWithdrawFee, 
  getFeeDenominator, 
  deposit,
  withdraw
} from "../lib/investmentUtils";

export default function Investments() {
  const activeWallet = useActiveWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("1");
  const [userShare, setUserShare] = useState("0");
  const [totalShares, setTotalShares] = useState("0");
  const [withdrawFee, setWithdrawFee] = useState(1); // Default 1%
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [mntPriceInUSD, setMntPriceInUSD] = useState(0);
  const [isPriceFetching, setIsPriceFetching] = useState(true);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const [userCurrentValue, setUserCurrentValue] = useState("0");
  const [totalPoolValue, setTotalPoolValue] = useState("0");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get the wallet balance
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance({
    address: walletAddress || "",
    chain: mantleSepolia,
    client,
  });
  
  const [displayValue, setDisplayValue] = useState("0");
  const [displaySymbol, setDisplaySymbol] = useState("MNT");

  useEffect(() => {
    if (activeWallet) {
      try {
        const address = activeWallet?.getAccount()?.address || "";
        setWalletAddress(address);
        if (address) {
          setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
          setIsWalletReady(true);
          fetchContractData(address);
        } else {
          setIsWalletReady(false);
        }
      } catch (error) {
        console.error("Error getting wallet address:", error);
        setIsWalletReady(false);
      }
    } else {
      setIsWalletReady(false);
    }
  }, [activeWallet]);
  
  // Fetch MNT price from CoinGecko
  useEffect(() => {
    const fetchMntPrice = async () => {
      try {
        setIsPriceFetching(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd');
        const data = await response.json();
        if (data.mantle && data.mantle.usd) {
          setMntPriceInUSD(data.mantle.usd);
        } else {
          console.error("Failed to get MNT price from API");
          setMntPriceInUSD(0.45); // Fallback value if API fails
        }
      } catch (error) {
        console.error("Error fetching MNT price:", error);
        setMntPriceInUSD(0.45); // Fallback value if API fails
      } finally {
        setIsPriceFetching(false);
      }
    };

    fetchMntPrice();
    
    // Refresh price every 5 minutes
    const intervalId = setInterval(fetchMntPrice, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    if (balanceData) {
      setDisplayValue(parseFloat(balanceData.displayValue).toFixed(4));
      setDisplaySymbol(balanceData.symbol);
    }
  }, [balanceData]);

  const usdValue = balanceData ? parseFloat(balanceData.displayValue) * mntPriceInUSD : 0;

  const fetchContractData = async (address: string) => {
    setIsLoading(true);
    try {
      // Use the getUserInvestmentInfo function to get all user data at once
      const investmentInfo = await getUserInvestmentInfo(address);
      
      if (investmentInfo) {
        setUserShare(ethers.formatEther(investmentInfo.userDepositMNT));
        setUserCurrentValue(ethers.formatEther(investmentInfo.userCurrentValue));
        setTotalPoolValue(ethers.formatEther(investmentInfo.totalPoolValue));
      }
      
      // Get total shares
      const totalSharesData = await getTotalShares();
      if (totalSharesData) {
        setTotalShares(ethers.formatEther(totalSharesData));
      }
      
      // Get withdraw fee
      const withdrawFeeData = await getWithdrawFee();
      const feeDenominatorData = await getFeeDenominator();
      
      if (withdrawFeeData && feeDenominatorData) {
        setWithdrawFee(Number(withdrawFeeData) / Number(feeDenominatorData) * 100);
      }
      
    } catch (error) {
      console.error("Error fetching contract data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!activeWallet || !investmentAmount) return;
    
    setIsDepositing(true);
    setError("");
    
    try {
      // Convert amount to wei
      const amountInWei = parseEther(investmentAmount);
      
      console.log("handleDeposit - Active Wallet:", {
        exists: !!activeWallet,
        type: typeof activeWallet,
        address: activeWallet?.getAccount()?.address || 'No address',
        details: JSON.stringify(activeWallet, (key, value) => 
          typeof value === 'bigint' ? value.toString() : 
          (typeof value === 'function' ? 'function' : value), 2)
      });
      
      console.log("handleDeposit - Amount:", {
        investmentAmount,
        amountInWei: amountInWei.toString()
      });
      
      // Use our deposit function from investment.ts
      const result = await deposit(amountInWei, activeWallet);
      
      console.log("handleDeposit - Transaction Result:", result);
      
      // Extract transaction hash from the result
      if (result && result.transactionHash) {
        setTxHash(result.transactionHash);
      }
      
      // Refresh data after transaction
      if (walletAddress) {
        fetchContractData(walletAddress);
      }
      
    } catch (error: any) {
      console.error("Error depositing:", error);
      setError(error.message || "Failed to deposit. Please try again.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!activeWallet) return;
    
    setIsWithdrawing(true);
    setError("");
    
    try {
      console.log("handleWithdraw - Active Wallet:", {
        exists: !!activeWallet,
        type: typeof activeWallet,
        address: activeWallet?.getAccount()?.address || 'No address'
      });
      
      // Use our withdraw function from investment.ts
      const result = await withdraw(activeWallet);
      
      console.log("handleWithdraw - Transaction Result:", result);
      
      // Extract transaction hash from the result
      if (result && result.transactionHash) {
        setTxHash(result.transactionHash);
      }
      
      // Refresh data after transaction
      if (walletAddress) {
        fetchContractData(walletAddress);
      }
      
    } catch (error: any) {
      console.error("Error withdrawing:", error);
      setError(error.message || "Failed to withdraw. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const userSharePercentage = totalShares && Number(totalShares) > 0 
    ? (Number(userShare) / Number(totalShares) * 100).toFixed(2)
    : "0.00";
    
  // Calculate investment USD value using the contract's calculated value
  const investmentUsdValue = Number(userCurrentValue) * mntPriceInUSD;

  // Calculate profit/loss
  const profitLossMNT = Number(userCurrentValue) - Number(userShare);
  const profitLossPercentage = Number(userShare) > 0 
    ? (profitLossMNT / Number(userShare) * 100).toFixed(2)
    : "0.00";
  const isProfitable = profitLossMNT >= 0;

  // Determine if we should show loading state
  const isComponentLoading = !isWalletReady || isBalanceLoading || isPriceFetching;

  const handleRefresh = async () => {
    if (!walletAddress) return;
    
    setIsRefreshing(true);
    try {
      await fetchContractData(walletAddress);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col w-full space-y-6">
          {/* Wallet info and refresh */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <WalletIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">{shortAddress || "Connect wallet"}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing || !isWalletReady}
              className="h-8 px-2"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Investment stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet balance and investments side */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Wallet Balance</h3>
                {isBalanceLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">{displayValue} {displaySymbol}</span>
                    <span className="ml-2 text-sm text-gray-500">(${usdValue.toFixed(2)})</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Investment</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">{Number(userCurrentValue).toFixed(4)} {displaySymbol}</span>
                    <span className="ml-2 text-sm text-gray-500">(${investmentUsdValue.toFixed(2)})</span>
                  </div>
                )}
                
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">P/L:</span>
                  <span className={`text-xs font-medium ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                    {isProfitable ? '+' : ''}{profitLossMNT.toFixed(4)} MNT ({isProfitable ? '+' : ''}{profitLossPercentage}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action buttons and input side */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
                <Button 
                  onClick={handleDeposit} 
                  disabled={isDepositing || !isWalletReady || Number(investmentAmount) <= 0}
                  className="whitespace-nowrap"
                >
                  {isDepositing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Deposit
                </Button>
              </div>
              
              <Button 
                onClick={handleWithdraw} 
                disabled={isWithdrawing || !isWalletReady || Number(userShare) <= 0}
                variant="outline"
                className="w-full"
              >
                {isWithdrawing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Withdraw (Fee: {withdrawFee.toFixed(1)}%)
              </Button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-sm text-red-500 mt-4">
              {error}
            </div>
          )}

          {/* Transaction hash */}
          {txHash && (
            <div className="text-xs text-gray-500 mt-2">
              Transaction: {txHash}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 