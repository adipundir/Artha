// import { Contract, JsonRpcProvider, Wallet, formatUnits } from 'ethers';

// // Contract ABI (only the functions we need)
// const CONTRACT_ABI = [
//   "function swapUSDCToMNT(uint256 amount) external",
//   "function _swapMNTToUSDC(uint256 amount) internal", // Note: This is internal in the contract
//   "function getPoolTokenBalances() external view returns (uint256 usdcBalance, uint256 mntBalance)"
// ];

// // Contract address - replace with your deployed contract address
// const CONTRACT_ADDRESS = '0x000000000000000000000000000000000000'; // Replace with actual address

// // Mantle Sepolia RPC URL
// const MANTLE_SEPOLIA_RPC = "https://rpc.sepolia.mantle.xyz";

// /**
//  * Executes a trade based on the provided action (buy or sell)
//  * @param action 'buy' or 'sell' - buy means swap USDC to MNT, sell means swap MNT to USDC
//  * @param amountPercentage percentage of available balance to trade (0-100)
//  * @param privateKey the wallet's private key to execute the transaction
//  * @returns transaction hash if successful
//  */
// export async function executeBlockchainTrade(
//   action: 'buy' | 'sell',
//   amountPercentage: number = 10, // Default to using 10% of available balance
//   privateKey: string
// ): Promise<string> {
//   try {
//     // Create provider and wallet
//     const provider = new JsonRpcProvider(MANTLE_SEPOLIA_RPC);
//     const wallet = new Wallet(privateKey, provider);
    
//     // Create contract instance
//     const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
//     // Get current token balances
//     const { usdcBalance, mntBalance } = await contract.getPoolTokenBalances();
    
//     // Calculate amount to trade based on percentage
//     let tradeAmount;
//     let txHash;
    
//     if (action === 'buy') {
//       // Buy MNT with USDC
//       tradeAmount = usdcBalance * BigInt(amountPercentage) / BigInt(100);
      
//       // Execute the trade
//       const tx = await contract.swapUSDCToMNT(tradeAmount);
//       await tx.wait();
//       txHash = tx.hash;
      
//       console.log(`Bought MNT with ${formatUnits(tradeAmount, 6)} USDC`);
//     } else {
//       // Sell MNT for USDC - Note: This is problematic as _swapMNTToUSDC is internal
//       // We would need to modify the contract or use a separate public function
//       throw new Error('Direct MNT to USDC swap not accessible - contract method is internal');
      
//       // If the function was public, it would look like this:
//       // tradeAmount = mntBalance * BigInt(amountPercentage) / BigInt(100);
//       // const tx = await contract.swapMNTToUSDC(tradeAmount);
//       // await tx.wait();
//       // txHash = tx.hash;
//     }
    
//     return txHash;
//   } catch (error) {
//     console.error('Error executing blockchain trade:', error);
//     throw error;
//   }
// } 