"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownUp } from "lucide-react"

// Mock data for MNT/USDC activity feed
const activities = [
  {
    id: 1,
    time: "10:45 AM",
    token: "MNT",
    action: "Buy",
    amount: 100,
    price: 0.48,
    balance: 1100,
    profit: null,
  },
  {
    id: 2,
    time: "09:30 AM",
    token: "MNT",
    action: "Sell",
    amount: 50,
    price: 0.49,
    balance: 1000,
    profit: 0.5,
  },
  {
    id: 3,
    time: "Yesterday",
    token: "MNT",
    action: "Buy",
    amount: 200,
    price: 0.46,
    balance: 1050,
    profit: null,
  },
  {
    id: 4,
    time: "Yesterday",
    token: "MNT",
    action: "Sell",
    amount: 200,
    price: 0.47,
    balance: 850,
    profit: -2.0,
  },
  {
    id: 5,
    time: "2 days ago",
    token: "MNT",
    action: "Buy",
    amount: 300,
    price: 0.45,
    balance: 1050,
    profit: null,
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">MNT/USDC Activity Feed</CardTitle>
        <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 border-b pb-4">
                <div className="min-w-[70px] text-sm text-muted-foreground">{activity.time}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={activity.action === "Buy" ? "default" : "destructive"}
                      className={activity.action === "Buy" ? "bg-green-500" : ""}
                    >
                      {activity.action}
                    </Badge>
                    <span className="font-medium">
                      {activity.amount} {activity.token}
                    </span>
                    <span className="text-sm text-muted-foreground">@ ${activity.price.toFixed(2)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">New balance: </span>
                    <span>
                      {activity.balance} {activity.token}
                    </span>

                    {activity.profit !== null && (
                      <span className={`ml-2 ${activity.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {activity.profit >= 0 ? "+" : ""}
                        {activity.profit.toFixed(2)} USD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
