"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useActiveWallet } from "thirdweb/react"

export default function LandingPage() {
  const activeWallet = useActiveWallet();
  const isConnected = !!activeWallet;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header removed since it's now in the layout */}
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-73px)] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Floating Mantle coins and ThirdWeb logos */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Left side */}
            <div className="absolute top-1/5 left-1/6 w-16 h-16 opacity-15 animate-float">
              <Image src="/mantleCoin.webp" alt="" width={64} height={64} className="object-contain" />
            </div>
            <div className="absolute bottom-1/3 left-1/5 w-20 h-20 opacity-12 animate-float" style={{ animationDelay: '2s' }}>
              <Image src="/mantleCoin.webp" alt="" width={80} height={80} className="object-contain" />
            </div>
            <div className="absolute top-2/3 left-1/4 w-12 h-12 opacity-10 animate-float" style={{ animationDelay: '3.5s' }}>
              <Image src="/mantleCoin.webp" alt="" width={48} height={48} className="object-contain" />
            </div>
            
            {/* Right side */}
            <div className="absolute top-1/4 right-1/6 w-14 h-14 opacity-15 animate-float" style={{ animationDelay: '4.2s' }}>
              <Image src="/mantleCoin.webp" alt="" width={56} height={56} className="object-contain" />
            </div>
            <div className="absolute bottom-1/5 right-1/5 w-12 h-12 opacity-10 animate-float" style={{ animationDelay: '5s' }}>
              <Image src="/mantleCoin.webp" alt="" width={48} height={48} className="object-contain" />
            </div>
            <div className="absolute top-1/2 right-1/4 w-10 h-10 opacity-12 animate-float" style={{ animationDelay: '3.2s' }}>
              <Image src="/mantleCoin.webp" alt="" width={40} height={40} className="object-contain" />
            </div>
            
            {/* Center area - subtle background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-8 animate-float" style={{ animationDelay: '2.8s', zIndex: -1 }}>
              <Image src="/mantleCoin.webp" alt="" width={80} height={80} className="object-contain" />
            </div>
            <div className="absolute top-2/5 left-[42%] w-16 h-16 opacity-6 animate-float" style={{ animationDelay: '1.5s', zIndex: -1 }}>
              <Image src="/mantleCoin.webp" alt="" width={64} height={64} className="object-contain" />
            </div>
            <div className="absolute top-[60%] left-[58%] w-14 h-14 opacity-7 animate-float" style={{ animationDelay: '3.3s', zIndex: -1 }}>
              <Image src="/mantleCoin.webp" alt="" width={56} height={56} className="object-contain" />
            </div>
            <div className="absolute top-[25%] left-[56%] w-10 h-10 opacity-8 animate-float" style={{ animationDelay: '4.7s', zIndex: -1 }}>
              <Image src="/mantleCoin.webp" alt="" width={40} height={40} className="object-contain" />
            </div>
            <div className="absolute top-[70%] left-[38%] w-12 h-12 opacity-6 animate-float" style={{ animationDelay: '5.5s', zIndex: -1 }}>
              <Image src="/mantleCoin.webp" alt="" width={48} height={48} className="object-contain" />
            </div>
          </div>
          
          {/* Grid decorative elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--background),0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--background),0.8)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
          
          <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-center gap-16 relative">
            {/* Visible middle logos - positioned between text and card */}
            <div className="absolute hidden md:block z-10" style={{ left: '46%', top: '20%' }}>
              <div className="w-16 h-16 opacity-35 animate-float">
                <Image src="/mantleCoin.webp" alt="" width={64} height={64} className="object-contain" />
              </div>
            </div>
            
            <div className="absolute hidden md:block z-10" style={{ left: '49%', top: '50%', transform: 'translateY(-50%)' }}>
              <div className="w-20 h-20 opacity-30 animate-float" style={{ animationDelay: '2.5s' }}>
                <Image src="/mantleCoin.webp" alt="" width={80} height={80} className="object-contain" />
              </div>
            </div>
            
            <div className="absolute hidden md:block z-10" style={{ left: '44%', top: '75%' }}>
              <div className="w-14 h-14 opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>
                <Image src="/mantleCoin.webp" alt="" width={56} height={56} className="object-contain" />
              </div>
            </div>
            
            <div className="absolute hidden md:block z-10" style={{ left: '56%', top: '35%' }}>
              <div className="w-12 h-12 opacity-20 animate-float" style={{ animationDelay: '3.2s' }}>
                <Image src="/mantleCoin.webp" alt="" width={48} height={48} className="object-contain" />
              </div>
            </div>
            
            <div className="absolute hidden md:block z-10" style={{ left: '53%', top: '65%' }}>
              <div className="w-10 h-10 opacity-25 animate-float" style={{ animationDelay: '4.3s' }}>
                <Image src="/mantleCoin.webp" alt="" width={40} height={40} className="object-contain" />
              </div>
            </div>
            
            <div className="md:w-5/12 text-center md:text-left space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-2">
                AI-Powered DeFi at your fingertips
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Invest Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Artha ✨</span>
            </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered trading on Mantle that maximizes your profits by analyzing market sentiment and whale portfolios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isConnected && (
                  <Button size="lg" className="px-8 rounded-full shadow-lg shadow-primary/20 relative overflow-hidden group" asChild>
                    <Link href="/dashboard">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 group-hover:scale-105 transition-transform duration-300"></span>
                      <span className="relative">Connect Wallet</span>
                    </Link>
                  </Button>
                )}
                
                {isConnected && (
                  <Button size="lg" className="px-8 rounded-full shadow-lg shadow-primary/20 relative overflow-hidden group" asChild>
                    <Link href="/dashboard">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 group-hover:scale-105 transition-transform duration-300"></span>
                      <span className="relative">Launch App</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="md:w-5/12 flex justify-center mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-xl"></div>
                <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-3xl p-6 shadow-xl min-w-[320px]">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold">Artha AI Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-medium">Nebula</span></p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full font-medium">Live</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Today's trades</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Trading frequency</span>
                      <span className="font-medium">Hourly</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">AI analysis</span>
                      <span className="font-medium">Real-time</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">Mantle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Trading</h3>
                <p className="text-muted-foreground">Automated buying and selling on Mantle using AI to make smart decisions for your portfolio.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Visualize performance trends and track whale portfolios to gain market insights.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Whale Portfolio Analysis</h3>
                <p className="text-muted-foreground">Gain insights from tracking major market players to identify profitable investment opportunities.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Artha</h2>
            <p className="text-lg text-center max-w-3xl mx-auto text-muted-foreground">
              Artha is built for both new and experienced DeFi traders who want better visibility and control over their investments. Our platform automatically executes trades on Mantle multiple times per day, completely free for all users. We analyze whale portfolios and use AI to determine optimal buying and selling strategies to maximize your profits.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">Made with ❤️ by Aditya</p>
            </div>
            <div className="flex space-x-4">
              <Link href="https://twitter.com/Adipundir" target="_blank" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                @Adipundir
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
