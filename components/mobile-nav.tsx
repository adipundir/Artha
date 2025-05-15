"use client"

import { X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useDisconnect, useActiveWallet } from "thirdweb/react";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleDisconnect = () => {
    if (activeWallet) {
      disconnect(activeWallet);
      router.push("/");
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="flex justify-between items-center border-b pb-4">
          <span className="font-semibold text-lg">AI Trading Platform</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Enable Auto-Trading</span>
            <Switch />
          </div>
          <div className="space-y-3 mt-6">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Wallet
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Activity
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleDisconnect}>
              <LogOut className="h-5 w-5 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
