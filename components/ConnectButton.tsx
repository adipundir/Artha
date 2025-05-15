"use client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet, useConnect, useDisconnect } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { inAppWallet, createWallet } from "thirdweb/wallets";
import { ethereum } from "thirdweb/chains";
import { defineChain } from "thirdweb/chains";


const mantleSepolia = defineChain({
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

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "x", "passkey", "phone", "apple"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

export function useWalletState() {
  const activeWallet = useActiveWallet();
  return {
    isConnected: !!activeWallet,
    activeWallet,
  };
}

function ConnectWalletButton() {
  const router = useRouter();
  const { isConnected } = useWalletState();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: "wide" }}
      accountAbstraction={{
        chain: mantleSepolia,
        sponsorGas: true,
      }}
      theme="light"
    />
  );
}

export default ConnectWalletButton;
