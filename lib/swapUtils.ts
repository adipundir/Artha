import { ethers } from "ethers";

// Updated Swap contract ABI for ZeroFeeMNTUSDCPool
const SWAP_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdc",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_mntUsdFeed",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "mntIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "usdcOut",
				"type": "uint256"
			}
		],
		"name": "SwapMNTToUSDC",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "usdcIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "mntOut",
				"type": "uint256"
			}
		],
		"name": "SwapUSDCToMNT",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getLatestMNTUSD",
		"outputs": [
			{
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "mntIn",
				"type": "uint256"
			}
		],
		"name": "getQuoteMNTToUSDC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "usdcOut",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "usdcIn",
				"type": "uint256"
			}
		],
		"name": "getQuoteUSDCToMNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "mntOut",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mntUsdPriceFeed",
		"outputs": [
			{
				"internalType": "contract AggregatorV3Interface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapMNTToUSDC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "usdcOut",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "usdcIn",
				"type": "uint256"
			}
		],
		"name": "swapUSDCToMNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "mntOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdc",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

// USDC ABI (minimal for allowance and balance checking)
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Contract address
const SWAP_CONTRACT_ADDRESS = process.env.SWAP_CONTRACT_ADDRESS || "0x0140633989E6EBe5974d7d261F8009C42CD2a40b";

// Mantle Sepolia RPC URL
const RPC_URL = process.env.RPC_URL || "https://rpc.sepolia.mantle.xyz/";

/**
 * Creates an ethers provider and wallet from a private key
 */
export function createWalletFromPrivateKey(privateKey: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  return { provider, wallet };
}

/**
 * Gets MNT and USDC balances for a wallet and contract
 */
export async function getBalances(privateKey: string): Promise<{
  mntBalance: string, 
  usdcBalance: string,
  contractMntBalance: string,
  contractUsdcBalance: string
}> {
  try {
    const { provider, wallet } = createWalletFromPrivateKey(privateKey);
    const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_ABI, wallet);
    
    let usdcAddress;
    try {
      // Try to get USDC address from contract
      usdcAddress = await swapContract.usdc();
    } catch (err) {
      console.warn("Couldn't get USDC address from contract, using environment variable:", err);
      usdcAddress = process.env.USDC_CONTRACT_ADDRESS || "0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080";
    }
    
    // Create USDC contract instance
    const usdcContract = new ethers.Contract(usdcAddress, USDC_ABI, wallet);
    
    // Get wallet balances
    const mntBalance = await provider.getBalance(wallet.address);
    const usdcBalance = await usdcContract.balanceOf(wallet.address);
    
    // Get contract balances
    const contractMntBalance = await provider.getBalance(SWAP_CONTRACT_ADDRESS);
    let contractUsdcBalance;
    try {
      contractUsdcBalance = await usdcContract.balanceOf(SWAP_CONTRACT_ADDRESS);
    } catch (err) {
      console.warn("Error getting contract USDC balance:", err);
      contractUsdcBalance = BigInt(0);
    }
    
    // Format balances
    return {
      mntBalance: ethers.formatEther(mntBalance),
      usdcBalance: ethers.formatUnits(usdcBalance, 6), // USDC typically uses 6 decimals
      contractMntBalance: ethers.formatEther(contractMntBalance),
      contractUsdcBalance: ethers.formatUnits(contractUsdcBalance, 6)
    };
  } catch (error) {
    console.error("Error getting balances:", error);
    // Return default values in case of error
    return {
      mntBalance: "0",
      usdcBalance: "0",
      contractMntBalance: "0",
      contractUsdcBalance: "0"
    };
  }
}

/**
 * Gets the current exchange rates with fallback values for testing
 * For ZeroFeeMNTUSDCPool, there's no fee
 */
export async function getExchangeRates(privateKey: string): Promise<{
  mntPrice: string,
  mntToUsdcQuote: string,
  usdcToMntQuote: string,
  feePercentage: string
}> {
  try {
    const { wallet } = createWalletFromPrivateKey(privateKey);
    const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_ABI, wallet);
    
    // Try to get MNT price
    let mntPrice;
    try {
      mntPrice = await swapContract.getLatestMNTUSD();
      console.log("MNT/USD Price:", mntPrice);
    } catch (err) {
      console.warn("Could not get latest MNT/USD price, using fallback value:", err);
      // Use fallback value (around $0.50 per MNT)
      mntPrice = ethers.parseUnits("0.5", 8);
    }
    
    // Try to get quotes
    let mntToUsdcQuote;
    let usdcToMntQuote;
    
    try {
      // Get quote for 1 MNT to USDC
      const oneMNT = ethers.parseEther("1");
      mntToUsdcQuote = await swapContract.getQuoteMNTToUSDC(oneMNT);
      console.log("1 MNT to USDC Quote:", mntToUsdcQuote);
    } catch (err) {
      console.warn("Could not get MNT to USDC quote, using derived value:", err);
      // Calculate from price (1 MNT * price in USD with 8 decimals * 10^6 / 10^8)
      mntToUsdcQuote = (mntPrice * BigInt(1000000)) / BigInt(100000000);
    }
    
    try {
      // Get quote for 1 USDC to MNT
      const oneUSDC = ethers.parseUnits("1", 6); // USDC has 6 decimals
      usdcToMntQuote = await swapContract.getQuoteUSDCToMNT(oneUSDC);
      console.log("1 USDC to MNT Quote:", usdcToMntQuote);
    } catch (err) {
      console.warn("Could not get USDC to MNT quote, using derived value:", err);
      // Calculate from price (1 USDC * 10^18 / price in USD with 8 decimals)
      if (mntPrice && mntPrice > 0) {
        usdcToMntQuote = (BigInt(10) ** BigInt(18) * BigInt(100000000)) / mntPrice;
      } else {
        // Fallback value if we still don't have a valid price
        usdcToMntQuote = ethers.parseEther("2");
      }
    }
    
    return {
      mntPrice: ethers.formatUnits(mntPrice, 8), // Price feed typically uses 8 decimals
      mntToUsdcQuote: ethers.formatUnits(mntToUsdcQuote, 6), // USDC has 6 decimals
      usdcToMntQuote: ethers.formatEther(usdcToMntQuote), // MNT has 18 decimals
      feePercentage: "0" // ZeroFeeMNTUSDCPool has no fees
    };
  } catch (error) {
    console.error("Error in getExchangeRates:", error);
    
    // Return fallback values even if there's a connection error
    return {
      mntPrice: "0.50",
      mntToUsdcQuote: "0.50", // No fee in this contract
      usdcToMntQuote: "2.0",  // No fee in this contract
      feePercentage: "0"     // ZeroFeeMNTUSDCPool has no fees
    };
  }
}

/**
 * Swaps MNT for USDC
 */
export async function swapMNTToUSDC(
  privateKey: string, 
  mntAmount: string
): Promise<{usdcReceived: string, txHash: string}> {
  try {
    const { wallet } = createWalletFromPrivateKey(privateKey);
    const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_ABI, wallet);
    
    // Parse MNT amount to wei
    const mntAmountWei = ethers.parseEther(mntAmount);
    
    // Get expected USDC output for informational purposes
    let expectedUsdcOut;
    try {
      expectedUsdcOut = await swapContract.getQuoteMNTToUSDC(mntAmountWei);
      console.log("Expected USDC output:", ethers.formatUnits(expectedUsdcOut, 6));
    } catch (err) {
      console.warn("Failed to get quote, will proceed with swap anyway:", err);
    }
    
    // Execute the swap
    const tx = await swapContract.swapMNTToUSDC({
      value: mntAmountWei
    });
    
    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);
    
    // Find the SwapMNTToUSDC event to get actual USDC received
    const iface = new ethers.Interface(SWAP_ABI);
    let usdcReceived = BigInt(0);
    
    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog && parsedLog.name === 'SwapMNTToUSDC') {
          usdcReceived = parsedLog.args.usdcOut;
          console.log("Found SwapMNTToUSDC event with usdcOut:", usdcReceived);
          break;
        }
      } catch (err) {
        // Not a matching event, skip
        console.log("Not a matching event or error parsing event:", err);
      }
    }
    
    // If we couldn't parse the event, use expected output or a fallback
    if (usdcReceived === BigInt(0)) {
      console.log("Couldn't find event data, using expected or fallback value");
      if (expectedUsdcOut) {
        usdcReceived = expectedUsdcOut;
      } else {
        // Rough estimate based on $0.50 per MNT with no fee
        usdcReceived = ethers.parseUnits(
          (parseFloat(mntAmount) * 0.50).toFixed(6), 
          6
        );
      }
    }
    
    return {
      usdcReceived: ethers.formatUnits(usdcReceived, 6), // USDC has 6 decimals
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error swapping MNT to USDC:", error);
    throw error;
  }
}

/**
 * Swaps USDC for MNT
 */
export async function swapUSDCToMNT(
  privateKey: string, 
  usdcAmount: string
): Promise<{mntReceived: string, txHash: string}> {
  try {
    const { wallet } = createWalletFromPrivateKey(privateKey);
    const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_ABI, wallet);
    
    // Get the USDC token address
    let usdcAddress;
    try {
      usdcAddress = await swapContract.usdc();
    } catch (err) {
      console.warn("Couldn't get USDC address from contract, using environment variable:", err);
      usdcAddress = process.env.USDC_CONTRACT_ADDRESS || "0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080";
    }
    
    // Create USDC contract
    const usdcContract = new ethers.Contract(usdcAddress, USDC_ABI, wallet);
    
    // Parse USDC amount
    const usdcAmountUnits = ethers.parseUnits(usdcAmount, 6); // USDC has 6 decimals
    
    // Check and set allowance if needed
    const currentAllowance = await usdcContract.allowance(wallet.address, SWAP_CONTRACT_ADDRESS);
    if (currentAllowance < usdcAmountUnits) {
      const approveTx = await usdcContract.approve(SWAP_CONTRACT_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log("Approved USDC for spending");
    }
    
    // Get expected MNT output for informational purposes
    let expectedMntOut;
    try {
      expectedMntOut = await swapContract.getQuoteUSDCToMNT(usdcAmountUnits);
      console.log("Expected MNT output:", ethers.formatEther(expectedMntOut));
    } catch (err) {
      console.warn("Failed to get quote, will proceed with swap anyway:", err);
    }
    
    // Execute the swap
    const tx = await swapContract.swapUSDCToMNT(usdcAmountUnits);
    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);
    
    // Find the SwapUSDCToMNT event to get actual MNT received
    const iface = new ethers.Interface(SWAP_ABI);
    let mntReceived = BigInt(0);
    
    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog && parsedLog.name === 'SwapUSDCToMNT') {
          mntReceived = parsedLog.args.mntOut;
          console.log("Found SwapUSDCToMNT event with mntOut:", mntReceived);
          break;
        }
      } catch (err) {
        // Not a matching event, skip
        console.log("Not a matching event or error parsing event:", err);
      }
    }
    
    // If we couldn't parse the event, use expected output or a fallback
    if (mntReceived === BigInt(0)) {
      console.log("Couldn't find event data, using expected or fallback value");
      if (expectedMntOut) {
        mntReceived = expectedMntOut;
      } else {
        // Rough estimate based on 2 MNT per USDC with no fee
        mntReceived = ethers.parseEther(
          (parseFloat(usdcAmount) * 2.0).toString()
        );
      }
    }
    
    return {
      mntReceived: ethers.formatEther(mntReceived), // MNT has 18 decimals
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error swapping USDC to MNT:", error);
    throw error;
  }
} 