import { getContract, readContract, prepareContractCall, sendTransaction } from "thirdweb";
import { mantleSepolia } from "@/config/chains";
import { client } from "@/components/ConnectButton";

console.log("Environment variables:", {
  contractAddress: process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS,
  isDefined: typeof process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS !== 'undefined',
  isEmpty: process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS === '',
});

// get a contract
export const InvestmentContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: mantleSepolia,
  // the contract's address
  address: process.env.NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS!,
  // OPTIONAL: the contract's abi
  abi: [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_swapper",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_usdc",
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
				"indexed": false,
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Rebalanced",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "FEE_DENOMINATOR",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WITHDRAW_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserInvestmentInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "userDepositMNT",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "userCurrentValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPoolValue",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
	},
	{
		"inputs": [],
		"name": "swapper",
		"outputs": [
			{
				"internalType": "contract ISwapContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalShares",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userShares",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
});

// Wrapper functions for contract methods

/**
 * Get the fee denominator used for calculations
 * @returns Promise with the fee denominator
 */
export async function getFeeDenominator(): Promise<bigint> {
  return await readContract({
    contract: InvestmentContract,
    method: "FEE_DENOMINATOR"
  });
}

/**
 * Get the withdraw fee percentage
 * @returns Promise with the withdraw fee
 */
export async function getWithdrawFee(): Promise<bigint> {
  return await readContract({
    contract: InvestmentContract,
    method: "WITHDRAW_FEE"
  });
}

/**
 * Deposit MNT into the investment contract
 * @param amount - Amount of MNT to deposit (in wei)
 * @param wallet - The wallet to use for the transaction
 * @returns Promise with the transaction result
 */
export async function deposit(amount: bigint, wallet: any) {
  console.log("Deposit function called with:", { 
    amount: amount.toString(),
    wallet: wallet ? 'Wallet object exists' : 'undefined',
  });
  console.log("Contract address:", InvestmentContract.address);
  
  // Get the account from the wallet
  const account = wallet?.getAccount?.();
  console.log("Account from wallet:", account ? 'Account exists' : 'undefined');
  
  if (!account) {
    throw new Error("No account found in wallet");
  }
  
  const transaction = prepareContractCall({
    contract: InvestmentContract,
    method: "deposit",
    value: amount
  });
  
  console.log("Prepared transaction:", transaction);

  return await sendTransaction({
    account,
    transaction
  });
}

/**
 * Get user investment information
 * @param userAddress - Address of the user
 * @returns Promise with user investment details
 */
export async function getUserInvestmentInfo(userAddress: string): Promise<{
  userDepositMNT: bigint;
  userCurrentValue: bigint;
  totalPoolValue: bigint;
}> {
  const result = await readContract({
    contract: InvestmentContract,
    method: "getUserInvestmentInfo",
    params: [userAddress]
  });
  
  return {
    userDepositMNT: result[0],
    userCurrentValue: result[1],
    totalPoolValue: result[2]
  };
}

/**
 * Get the contract owner address
 * @returns Promise with the owner address
 */
export async function getOwner(): Promise<string> {
  return await readContract({
    contract: InvestmentContract,
    method: "owner"
  });
}

/**
 * Rebalance the investment portfolio
 * @param mode - Rebalance mode (uint8)
 * @param account - The wallet account to use for the transaction
 * @returns Promise with the transaction result
 */
export async function rebalance(mode: number, account: any) {
  const transaction = prepareContractCall({
    contract: InvestmentContract,
    method: "rebalance",
    params: [mode]
  });

  return await sendTransaction({
    account,
    transaction
  });
}

/**
 * Get the swapper contract address
 * @returns Promise with the swapper address
 */
export async function getSwapper(): Promise<string> {
  return await readContract({
    contract: InvestmentContract,
    method: "swapper"
  });
}

/**
 * Get the total shares in the investment pool
 * @returns Promise with the total shares
 */
export async function getTotalShares(): Promise<bigint> {
  return await readContract({
    contract: InvestmentContract,
    method: "totalShares"
  });
}

/**
 * Get the USDC token address
 * @returns Promise with the USDC address
 */
export async function getUSDCAddress(): Promise<string> {
  return await readContract({
    contract: InvestmentContract,
    method: "usdc"
  });
}

/**
 * Get user shares in the investment pool
 * @param userAddress - Address of the user
 * @returns Promise with the user's shares
 */
export async function getUserShares(userAddress: string): Promise<bigint> {
  return await readContract({
    contract: InvestmentContract,
    method: "userShares",
    params: [userAddress]
  });
}

/**
 * Withdraw invested funds
 * @param wallet - The wallet to use for the transaction
 * @returns Promise with the transaction result
 */
export async function withdraw(wallet: any) {
  console.log("Withdraw function called with wallet:", wallet ? 'Wallet exists' : 'undefined');
  console.log("Contract address:", InvestmentContract.address);
  
  // Get the account from the wallet
  const account = wallet?.getAccount?.();
  console.log("Account from wallet:", account ? 'Account exists' : 'undefined');
  
  if (!account) {
    throw new Error("No account found in wallet");
  }
  
  const transaction = prepareContractCall({
    contract: InvestmentContract,
    method: "withdraw"
  });
  
  console.log("Prepared transaction:", transaction);

  return await sendTransaction({
    account,
    transaction
  });
}
