'use server';

import { revalidatePath } from 'next/cache';
// import { executeBlockchainTrade } from '../../lib/blockchainUtils';
import { Nebula } from "thirdweb/ai";
import { createThirdwebClient } from "thirdweb";

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

/**
 * Fetches the top 10 MNT token holders from the Mantle blockchain
 * @returns Promise<Array<{address: string, shortAddress: string, mntBalance: number, usdValue: number, lastActivity: string}>>
 */
export async function getTopMntHolders() {
  try {
    // Real API endpoint for WMNT token holders from Mantle Explorer
    const apiUrl = 'https://explorer.mantle.xyz/api/v2/tokens/0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8/holders';
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data: ApiResponse = await response.json();
    
    // Process the API response to extract holder information
    const holders = data.items.slice(0, 10).map((item, index) => {
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
    
    const mockHolders = [
      {
        id: 1,
        address: "0x5d54d430D1FD9425976147318E6080479bffC16D",
        shortAddress: "0x5d54...C16D",
        mntBalance: 8624576,
        usdValue: 5102690,
        lastActivity: "Recently",
        is_contract: true,
        name: "Liquidity Book Token"
      },
      {
        id: 2,
        address: "0xeAfc4D6d4c3391Cd4Fc10c85D2f5f972d58C0dD5",
        shortAddress: "0xeAfc...0dD5",
        mntBalance: 4404851,
        usdValue: 2606080,
        lastActivity: "Recently",
        is_contract: true,
        name: "AgniPool"
      },
      {
        id: 3,
        address: "0x683696523512636B46A826A7e3D1B0658E8e2e1c",
        shortAddress: "0x6836...2e1c",
        mntBalance: 2445617,
        usdValue: 1447024,
        lastActivity: "Recently",
        is_contract: true,
        name: "Lendle Mantle Market WMNT"
      },
      {
        id: 4,
        address: "0x44949636f778fAD2b139E665aee11a2dc84A2976",
        shortAddress: "0x4494...2976",
        mntBalance: 1134991,
        usdValue: 671573,
        lastActivity: "Recently",
        is_contract: true,
        name: "INIT Wrapped Mantle"
      },
      {
        id: 5,
        address: "0x524db930F0886CdE7B5FFFc920Aae85e98C2abfb",
        shortAddress: "0x524d...abfb",
        mntBalance: 622429,
        usdValue: 368277,
        lastActivity: "Recently",
        is_contract: true,
        name: "Contract"
      },
      {
        id: 6,
        address: "0x15Bb5D31048381c84a157526cEF9513531b8BE1e",
        shortAddress: "0x15Bb...BE1e",
        mntBalance: 610297,
        usdValue: 361088,
        lastActivity: "Recently",
        is_contract: false,
        name: null
      },
      {
        id: 7,
        address: "0x763868612858358f62b05691dB82Ad35a9b3E110",
        shortAddress: "0x7638...E110",
        mntBalance: 569070,
        usdValue: 336695,
        lastActivity: "Recently",
        is_contract: true,
        name: "Moe LP Token"
      },
      {
        id: 8,
        address: "0x762B916297235dc920a8c684419e41Ab0099A242",
        shortAddress: "0x762B...9A242",
        mntBalance: 172648,
        usdValue: 102146,
        lastActivity: "Recently",
        is_contract: true,
        name: "Volatile Pair - WMNT/CLEO"
      },
      {
        id: 9,
        address: "0x1606C79bE3EBD70D8d40bAc6287e23005CfBefA2",
        shortAddress: "0x1606...BefA2",
        mntBalance: 167449,
        usdValue: 99077,
        lastActivity: "Recently",
        is_contract: true,
        name: "Liquidity Book Token"
      },
      {
        id: 10,
        address: "0x6Cc1560EFe633E8799226c87c45981ef93cFa617",
        shortAddress: "0x6Cc1...Fa617",
        mntBalance: 166080,
        usdValue: 98263,
        lastActivity: "Recently",
        is_contract: true,
        name: "Minterest Wrapped MNT"
      }
    ];
    
    return mockHolders;
  }
}

/**
 * Consults Nebula AI for MNT/USDC trading signals
 * Analyzes current market conditions and whale wallets to determine optimal trading strategy
 * @returns Promise<{ action: 'buy' | 'sell', confidence: number }>
 */
export async function getNebulaTradeSignal(): Promise<{ action: 'buy' | 'sell', confidence: number }> {
  try {
    // First fetch the top MNT holders
    const topHolders = await getTopMntHolders();
    
    // Format the holders data for the prompt
    const holdersData = topHolders.map(holder => {
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
        
        Should I BUY or SELL MNT right now to maximize profits?
        
        Provide ONLY A SINGLE WORD answer (BUY or SELL) followed by a confidence score from 0-100, seperated by a comma.
      `,
    });

    if (!response) {
      throw new Error('No response from Nebula');
    }

    // Log the response type and structure
    console.log(`Nebula response type:`, typeof response);
    console.log(`Nebula response properties:`, Object.keys(response));
    console.log(`Nebula raw response:`, response);

    // Process the AI response
    // According to thirdweb docs, Nebula.chat returns an object with a message property
    let responseText = '';
    
    // Convert to string safely using JSON.stringify first
    const responseStr = JSON.stringify(response);
    console.log(`Response as string: ${responseStr}`);
    
    // Try to access the message property if it exists
    try {
      if (typeof response === 'object' && response !== null && 'message' in response) {
        // Use type assertion to tell TypeScript this is a string
        responseText = (response as { message: string }).message.toLowerCase();
      } else {
        // Fallback to using the stringified version
        responseText = responseStr.toLowerCase();
      }
    } catch (error) {
      console.error('Error parsing Nebula response:', error);
      responseText = responseStr.toLowerCase();
    }
    
    console.log(`Parsed response text: ${responseText}`);
    
    const action = responseText.includes('buy') ? 'buy' : 'sell';
    
    // Extract confidence score - this regex looks for numbers between 0-100
    const confidenceMatch = responseText.match(/\b([0-9]|[1-9][0-9]|100)\b/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[0]) : 50; // Default to 50% if not provided
    
    // Invalidate any cached data that might depend on this signal
    revalidatePath('/dashboard');
    
    return { action, confidence };
  } catch (error) {
    console.error('Error getting trade signal from Nebula:', error);
    // Default to a neutral position with low confidence if there's an error
    return { action: 'sell', confidence: 0 };
  }
}

/**
 * Executes a trade based on the Nebula signal
 * Could be called by a scheduled job every 15 minutes
 * @returns Promise<{ success: boolean, transaction: string | null, action: 'buy' | 'sell', confidence: number, topHolders: any[] }>
 */
// export async function executeAutomatedTrade(): Promise<{ 
//   success: boolean, 
//   transaction: string | null, 
//   action: 'buy' | 'sell', 
//   confidence: number,
//   topHolders: any[]
// }> {
//   try {
//     // Get the top MNT holders first
//     const topHolders = await getTopMntHolders();
    
//     // Get the trading signal (which already uses the top holders info)
//     const { action, confidence } = await getNebulaTradeSignal();
    
//     // Only execute trades with sufficient confidence
//     if (confidence < 60) {
//       console.log(`Trade signal confidence too low (${confidence}%), skipping execution`);
//       return { success: false, transaction: null, action, confidence, topHolders };
//     }
    
//     // Execute the trade on the blockchain
//     // The amount percentage could be dynamic based on confidence
//     const amountPercentage = Math.min(Math.max(Math.floor(confidence / 10), 5), 30);
    
//     try {
//       const txHash = await executeBlockchainTrade(action, amountPercentage);
//       console.log(`Executed ${action} trade for MNT/USDC with ${confidence}% confidence. Tx: ${txHash}`);
//       return { success: true, transaction: txHash, action, confidence, topHolders };
//     } catch (error) {
//       console.error('Blockchain transaction failed:', error);
//       return { success: false, transaction: null, action, confidence, topHolders };
//     }
//   } catch (error) {
//     console.error('Error executing automated trade:', error);
//     return { success: false, transaction: null, action: 'sell', confidence: 0, topHolders: [] };
//   }
// } 