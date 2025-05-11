import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AutoConnect, ThirdwebProvider } from "thirdweb/react";
import { client } from "@/components/ConnectButton";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artha - DeFi Profit Maximizer",
  description: "The intelligent DeFi profit tracking and portfolio management platform built for modern traders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThirdwebProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AutoConnect client={client} />
          <Navbar />
          {children}
        </body>
      </html>
    </ThirdwebProvider>
  );
}
