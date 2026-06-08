import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { indexedNAV } from '../../utils/navUtils'
import { useMemo } from 'react'
import { COLORS, tooltipStyle } from '../../utils/theme'

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
    <div style={tooltipStyle}>
      <p style={{ color: '#5a544a', marginBottom: 6, fontSize: 11 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontWeight: 700, margin: '2px 0' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, color: '#5a544a', fontSize: 13 }}>
        No NAV data available
      </div>
    )
  }

  const tickInterval = Math.max(1, Math.floor(chartData.length / 8))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1b15" />
        <XAxis
          dataKey="date"
          tickFormatter={d => d?.slice(0, 7)}
          interval={tickInterval}
          tick={{ fontSize: 11, fill: '#5a544a' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fontSize: 11, fill: '#5a544a' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}`}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => {
            const idx = parseInt(value.split('_')[1])
            return <span style={{ fontSize: 12, color: '#8a8174' }}>{funds[idx]?.scheme_name?.split(' - ')[0]?.slice(0, 30)}</span>
          }}
        />
        <ReferenceLine y={100} stroke="#3a352c" strokeDasharray="4 4" label={{ value: 'Base 100', fill: '#3a352c', fontSize: 10 }} />
        {funds.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`fund_${i}`}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: COLORS[i % COLORS.length] }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
