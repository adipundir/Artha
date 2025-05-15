import { defineChain } from "thirdweb/chains";

export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  rpc: "https://rpc.sepolia.mantle.xyz",
  nativeCurrency: {
    name: "Mantle Sepolia MNT",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Mantle Sepolia Explorer",
      url: "https://explorer.sepolia.mantle.xyz",
    },
  ],
  testnet: true,
}); 