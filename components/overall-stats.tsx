"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Shield, AlertTriangle, ArrowRight } from "lucide-react"
import { Progress } from "./ui/progress"


export function OverallStats() {
  // Mock portfolio allocation data
  const portfolioData = [
    { name: "MNT", value: 45, color: "#8884d8" },
    { name: "USDC", value: 25, color: "#82ca9d" },
    { name: "ETH", value: 20, color: "#ffc658" },
    { name: "Other", value: 10, color: "#ff8042" }
  ]

  // Risk assessment score (0-100)
  const riskScore = 65

  // Risk category based on score
  const getRiskCategory = (score : number) => {
    if (score < 30) return { label: "Low", color: "text-green-500", icon: <Shield className="h-4 w-4 mr-1" /> }
    if (score < 70) return { label: "Medium", color: "text-amber-500", icon: <AlertTriangle className="h-4 w-4 mr-1" /> }
    return { label: "High", color: "text-red-500", icon: <AlertTriangle className="h-4 w-4 mr-1" /> }
  }

  const riskCategory = getRiskCategory(riskScore)

  // Calculate total portfolio value
  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Portfolio Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Asset Allocation Chart */}
          <div>
            <div className="text-sm font-medium mb-2">Asset Allocation</div>
            <div className="h-[120px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {portfolioData.map((asset) => (
                <div key={asset.name} className="flex items-center text-xs">
                  <div className="w-2 h-2 rounded mr-1" style={{ backgroundColor: asset.color }}></div>
                  <span>{asset.name}: {asset.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <div className="text-sm font-medium mb-2">Risk Assessment</div>
            <div className="flex items-center mb-1">
              <div className={`flex items-center ${riskCategory.color}`}>
                {riskCategory.icon}
                <span className="font-medium">{riskCategory.label} Risk</span>
              </div>
            </div>
            <Progress value={riskScore} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center text-sm">
              <ArrowRight className="h-4 w-4 mr-1 text-primary" />
              <span>Consider diversifying into more stablecoins to reduce risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
