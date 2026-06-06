import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { indexedNAV } from '../../utils/navUtils'
import { useMemo } from 'react'

const COLORS = ['#6366f1', '#f59e0b', '#10b981']

function mergeNavSeries(funds) {
  if (!funds.length) return []
  const dateMap = {}
  funds.forEach((fund, i) => {
    const indexed = indexedNAV(fund.nav_data || [])
    indexed.forEach(({ date, value }) => {
      if (!dateMap[date]) dateMap[date] = { date }
      dateMap[date][`fund_${i}`] = value
    })
  })
  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="text-slate-500 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-semibold">
          {entry.name}: {entry.value?.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

export default function NAVLineChart({ funds = [] }) {
  const chartData = useMemo(() => mergeNavSeries(funds), [funds])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No NAV data available
      </div>
    )
  }

  // Show at most 8 x-axis labels
  const tickInterval = Math.max(1, Math.floor(chartData.length / 8))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {funds.map((_, i) => (
            <linearGradient key={i} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tickFormatter={d => d?.slice(0, 7)}
          interval={tickInterval}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}`}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value, entry) => {
            const idx = parseInt(value.split('_')[1])
            return <span className="text-xs text-slate-600">{funds[idx]?.scheme_name?.split(' - ')[0]}</span>
          }}
        />
        <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Base 100', fill: '#94a3b8', fontSize: 10 }} />
        {funds.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`fund_${i}`}
            stroke={COLORS[i]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
