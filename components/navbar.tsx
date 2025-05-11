"use client"
import Link from "next/link"
import ConnectBtn from "./ConnectButton"
export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary">
                    <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 24L16 30L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="font-bold text-xl flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Artha</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/10 rounded-md text-primary">AI</span>
              </span>
            </div>
          </Link>
        </div>
        <nav className="space-x-4">
          <Link href="/#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <ConnectBtn />
        </nav>
      </div>
    </header>
  )
} 