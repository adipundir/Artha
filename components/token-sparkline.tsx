"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface TokenSparklineProps {
  data: number[]
  change: number
}

export function TokenSparkline({ data, change }: TokenSparklineProps) {
  const color = change >= 0 ? "#10b981" : "#ef4444"

  return (
    <ResponsiveContainer width="100%" height={30}>
      <LineChart data={data.map((value, index) => ({ value, index }))}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
