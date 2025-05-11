"use client";
import { createThirdwebClient } from "thirdweb";
import { useConnectModal, useActiveWallet, useDisconnect } from "thirdweb/react";
import { useState } from "react";

import { inAppWallet, createWallet } from "thirdweb/wallets";
import { ethereum } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "telegram", "x", "passkey", "phone", "email"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

function ConnectBtn() {
  const { connect, isConnecting } = useConnectModal();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isHovering, setIsHovering] = useState(false);
  
  const isConnected = !!activeWallet;
  
  // Get shortened address display when connected
  const address = activeWallet?.getAccount()?.address || "";
  const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const buttonStyle = "px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 relative overflow-hidden group inline-flex items-center justify-center min-h-[40px]";
  const gradientStyle = "absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 group-hover:scale-105 transition-transform duration-300";
  const textStyle = "relative text-sm font-semibold text-white flex items-center justify-center";

  return (
    <button
      className={buttonStyle}
      onClick={() => {
        if (isConnected) {
          disconnect(activeWallet);
        } else {
          connect({
            client,
            wallets,
            accountAbstraction: {
              chain: ethereum,
              sponsorGas: true,
            }
          });
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={gradientStyle}></span>
      {isConnected ? (
        <div className={`${textStyle} w-28 overflow-hidden h-full`}>
          {isHovering ? "Disconnect" : displayAddress}
        </div>
      ) : (
        <div className={`${textStyle} w-28 h-full`}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </div>
      )}
    </button>
  );
}

export default ConnectBtn;
export { client };