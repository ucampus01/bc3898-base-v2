// components/ui/Chart.tsx
// 차트 컴포넌트 (Recharts 사용)

'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartProps {
  data: any[]
  lines?: {
    dataKey: string
    stroke: string
    name: string
  }[]
  xAxisKey?: string
  height?: number
}

export default function Chart({ 
  data, 
  lines = [], 
  xAxisKey = 'name',
  height = 300 
}: ChartProps) {
  // 🔧 변경 가능: 기본 라인 설정
  const defaultLines = lines.length > 0 ? lines : [
    { dataKey: 'value', stroke: '#3B82F6', name: '값' }
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {defaultLines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.dataKey} 
            stroke={line.stroke}
            name={line.name}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// 🔧 변경 가능: 바 차트 컴포넌트
export function BarChartComponent({ 
  data, 
  bars = [], 
  xAxisKey = 'name',
  height = 300 
}: ChartProps) {
  const { BarChart, Bar } = require('recharts')
  
  const defaultBars = bars.length > 0 ? bars : [
    { dataKey: 'value', fill: '#3B82F6', name: '값' }
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {defaultBars.map((bar, index) => (
          <Bar 
            key={index}
            dataKey={bar.dataKey} 
            fill={bar.fill}
            name={bar.name}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}