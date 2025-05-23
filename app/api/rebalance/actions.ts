'use server';

import { ethers } from 'ethers';
import { getNebulaTradeSignal } from '@/app/actions';

// ABI fragment for the rebalance function
const INVESTMENT_ABI_FRAGMENT = [
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "mode",
        "type": "uint8"
      }
    ],
    "name": "rebalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/**
 * Decision function that returns a mode between 0 and 2 based on Nebula trade signal
 * @returns A number representing the rebalance mode (0 = hold, 1 = buy, 2 = sell)
 */
export async function decideRebalanceMode(): Promise<number> {
  try {
    // Get trading signal from Nebula
    const signal = await getNebulaTradeSignal();
    console.log(`Nebula trade signal: ${signal.action} with ${signal.confidence}% confidence`);
    
    // Map the action to a mode number
    // 0 = hold, 1 = buy, 2 = sell
    switch (signal.action) {
      case 'buy':
        return 1;
      case 'sell':
        return 2;
      case 'hold':
      default:
        return 0;
    }
  } catch (error) {
    console.error('Error determining rebalance mode:', error);
    
    // Fallback to simple time-based logic if there's an error
    const hour = new Date().getHours();
    
    if (hour < 8) {
      return 0; // Hold during early hours
    } else if (hour < 16) {
      return 1; // Buy during middle of day
    } else {
      return 2; // Sell during evening/night
    }
  }
}

/**
 * Server action to rebalance the investment contract
 * @param mode - The rebalance mode (0 = hold, 1 = buy, 2 = sell)
 * @returns The transaction hash or error message
 */
export async function rebalanceInvestment(mode: number): Promise<{ success: boolean; message: string; txHash?: string }> {
  try {
    // Check if mode is valid
    if (![0, 1, 2].includes(mode)) {
      return {
        success: false,
        message: `Invalid mode: ${mode}. Mode must be 0, 1, or 2.`
      };
    }

    // Get private key and contract address from environment variables
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS;

    // Validate environment variables are set
    if (!privateKey) {
      return {
        success: false,
        message: 'Deployer private key not configured in environment variables.'
      };
    }

    if (!contractAddress) {
      return {
        success: false,
        message: 'Investment contract address not configured in environment variables.'
      };
    }

    // Create RPC provider for Mantle Sepolia
    const rpcUrl = 'https://rpc.sepolia.mantle.xyz';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Create wallet and contract instances
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, INVESTMENT_ABI_FRAGMENT, wallet);

    // Log wallet address (for debugging, remove in production)
    console.log(`Calling rebalance with mode ${mode} from wallet: ${wallet.address}`);

    // Call the rebalance function
    const tx = await contract.rebalance(mode);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Return success with the transaction hash
    return {
      success: true,
      message: `Successfully rebalanced investment with mode: ${mode}`,
      txHash: receipt.hash
    };
  } catch (error: any) {
    // Log and return error
    console.error('Error rebalancing investment:', error);
    return {
      success: false,
      message: `Error rebalancing investment: ${error.message}`
    };
  }
} 