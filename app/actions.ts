'use server';

import { revalidatePath } from 'next/cache';
// import { executeBlockchainTrade } from '../../lib/blockchainUtils';
import { Nebula } from "thirdweb/ai";
import { createThirdwebClient } from "thirdweb";
import { mockHolders } from '@/lib/utils';

// Initialize the ThirdwebClient
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

// Define types for the Mantle Explorer API response
type AddressInfo = {
  hash: string;
  is_contract: boolean;
  name: string | null;
}

type TokenInfo = {
  exchange_rate: string;
}

type TokenHolder = {
  address: AddressInfo;
  token: TokenInfo;
  value: string;
}

type ApiResponse = {
  items: TokenHolder[];
}

// Define the type for portfolio analysis response
type PortfolioAnalysis = {
  analysis: string;
}

/**
 * Fetches the top 10 MNT token holders from the Mantle blockchain
 * @returns Promise<Array<{address: string, shortAddress: string, mntBalance: number, usdValue: number, lastActivity: string}>>
 */
export async function getTopMntHolders() {
  try {
    // Real API endpoint for WMNT token holders from Mantle Explorer
    const apiUrl = 'https://explorer.mantle.xyz/api/v2/tokens/0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8/holders';
    
    console.log(`Fetching data from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if the response has the expected structure
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Unexpected API response structure:', data);
      throw new Error('API response does not contain items array');
    }
    
    // Process the API response to extract holder information
    const holders = data.items.slice(0, 10).map((item: TokenHolder, index: number) => {
      // Extract the full address from the API response
      const address = item.address.hash;
      
      // Create a shortened version of the address for display purposes
      const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      
      // Convert the balance from wei to MNT (18 decimals)
      const balanceInWei = BigInt(item.value);
      const mntBalance = Number(balanceInWei / BigInt(10**14)) / 10000; // Convert to number with 4 decimal places
      
      // Calculate USD value based on exchange rate from API response
      const exchangeRate = parseFloat(item.token.exchange_rate);
      const usdValue = mntBalance * exchangeRate;
      
      return {
        id: index + 1,
        address,
        shortAddress,
        mntBalance,
        usdValue,
        lastActivity: "Recently", // This info isn't provided by the API, so we use a placeholder
        is_contract: item.address.is_contract,
        name: item.address.name || null
      };
    });
    
    console.log(`Retrieved top ${holders.length} MNT holders from Mantle Explorer API`);

    
    // Invalidate cache for components that might display this data
    revalidatePath('/dashboard');
    
    return holders;
  } catch (error) {
    console.error('Error fetching top MNT holders:', error);
    
    // Fallback to mock data if API call fails
    console.log('Falling back to mock data due to API error');
    
    // Return mock data
    
    return mockHolders;
  }
}

/**
 * Consults Nebula AI for MNT/USDC trading signals
 * Analyzes current market conditions and whale wallets to determine optimal trading strategy
 * @returns Promise<{ action: 'buy' | 'sell' | 'hold', confidence: number }>
 */
export async function getNebulaTradeSignal(): Promise<{ action: 'buy' | 'sell' | 'hold', confidence: number }> {
  try {
    // First fetch the top MNT holders
    const topHolders = await getTopMntHolders();
    
    // Format the holders data for the prompt
    const holdersData = topHolders.map((holder: {
      address: string;
      is_contract: boolean;
      name: string | null;
      mntBalance: number;
      usdValue: number;
    }) => {
      return `Address: ${holder.address} (${holder.is_contract ? 'Contract' : 'EOA'})${holder.name ? ` - ${holder.name}` : ''}
      MNT Balance: ${holder.mntBalance.toLocaleString()} ($${holder.usdValue.toLocaleString()})`;
    }).join('\n');
    
    // Using Nebula SDK from thirdweb
    const response = await Nebula.chat({
      client: client,
      message: `
        Analyze the current market conditions for the native token of Mantle, MNT, on the Mantle Blockchain.
        
        Here are the top 10 MNT holders:
        ${holdersData}
        
        Based on this data and your knowledge of:
        1. Current market trends and technical indicators for MNT
        2. Market sentiment and whale wallet behavior
        3. Distribution patterns among top holders
        
        Should I BUY, SELL, or HOLD MNT right now to maximize profits?
        
        Provide ONLY A SINGLE WORD answer (BUY, SELL, or HOLD) followed by a confidence score from 0-100, separated by a comma.
      `,
    });

    // Simplified response handling - Just extract the message as string
    let responseText = '';
    
    if (response) {
      // Check if response has a message property
      if (typeof response === 'object' && 'message' in response) {
        responseText = String(response.message).toLowerCase();
      } else {
        // If not, stringify the entire response
        responseText = String(JSON.stringify(response)).toLowerCase();
      }
    } else {
      throw new Error('No response from Nebula');
    }
    
    console.log(`Nebula response text:`, responseText);
    
    // Determine action based on simple pattern matching
    let action: 'buy' | 'sell' | 'hold';
    
    if (responseText.includes('buy')) {
      action = 'buy';
    } else if (responseText.includes('sell')) {
      action = 'sell';
    } else {
      action = 'hold'; // Default to hold if no clear signal
    }
    
    // Extract confidence score using a regex - look for numbers between 0-100
    const confidenceMatch = responseText.match(/\b([0-9]|[1-9][0-9]|100)\b/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[0]) : 50; // Default to 50% if not provided
    
    // Invalidate any cached data that might depend on this signal
    revalidatePath('/dashboard');
    console.log(`Trade signal: ${action} with confidence ${confidence}`);
    
    return { action, confidence };
  } catch (error) {
    console.error('Error getting trade signal from Nebula:', error);
    // Default to a neutral position with low confidence if there's an error
    return { action: 'hold', confidence: 50 };
  }
}

/**
 * Gets a simple portfolio analysis from Nebula for a wallet address on Mantle Sepolia testnet
 * @param walletAddress The wallet address to analyze
 * @returns Portfolio analysis data from Nebula
 */
export async function getNebulaPortfolioAnalysis(walletAddress: string): Promise<PortfolioAnalysis> {
  try {
    console.log(`Generating portfolio analysis for wallet: ${walletAddress}`);
    
    // Using Nebula SDK from thirdweb
    const response = await Nebula.chat({
      client: client,
      message: `
        Analyze the wallet ${walletAddress} on Mantle Sepolia testnet (chain ID 5003).
        
        Provide a short, concise textual analysis (about 3-4 sentences) of:
        1. What tokens this wallet holds
        2. The risk profile of this portfolio
        3. A recommendation for improvement
        
        Return ONLY the analysis text without any JSON formatting.
      `
    });

    console.log('Got response from Nebula');
    console.log('Full raw response from Nebula:', response.message);
    
    // Extract the analysis text
    const analysisText = String(response.message).trim();
    
    // Log the final response
    console.log('=== FINAL ANALYSIS SENT TO COMPONENT ===');
    console.log(analysisText);
    console.log('=========================================');
    
    // Invalidate cache for components that might display this data
    revalidatePath('/dashboard');
    
    return { analysis: analysisText };
  } catch (error) {
    console.error('Error getting portfolio analysis from Nebula:', error);
    // Return fallback data
    const fallbackAnalysis = "This wallet on Mantle Sepolia testnet contains mostly MNT with some USDC and minimal ETH. The portfolio has a high risk profile due to concentration in volatile assets. Consider rebalancing to include more stablecoins for better risk management.";
    console.log('=== FALLBACK ANALYSIS SENT TO COMPONENT DUE TO ERROR ===');
    console.log(fallbackAnalysis);
    console.log('=======================================================');
    return { analysis: fallbackAnalysis };
  }
}

/**
 * Get the current MNT price from CoinGecko or fallback
 */
async function getMNTPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd');
    const data = await response.json();
    if (data.mantle && data.mantle.usd) {
      return data.mantle.usd;
    }
  } catch (error) {
    console.error('Error fetching MNT price:', error);
  }
  return 0.45; // Fallback value if API fails
}

