"use client"
import Link from "next/link"
import ConnectBtn, { useWalletState } from "./ConnectButton"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { isConnected } = useWalletState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        
        {/* Mobile menu button and connect button */}
        <div className="md:hidden flex items-center gap-2">
          <ConnectBtn />
          <button 
            className="p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary inline-flex items-center">
            Home
          </Link>
          <Link href="/#features" className="text-sm font-medium hover:text-primary inline-flex items-center">
            Features
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:text-primary inline-flex items-center">
            About
          </Link>
          {isConnected && (
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary inline-flex items-center">
              Dashboard
            </Link>
          )}
          <div className="inline-flex items-center">
            <ConnectBtn />
          </div>
        </nav>
      </div>
      
      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-sm font-medium hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#features" 
              className="text-sm font-medium hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-medium hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isConnected && (
              <Link 
                href="/dashboard" 
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
} 