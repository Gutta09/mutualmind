import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { formatINR } from '../../utils/sipMath'
import { tooltipStyle } from '../../utils/theme'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const corpus   = payload.find(p => p.dataKey === 'corpus')?.value
  const invested = payload.find(p => p.dataKey === 'invested')?.value
  return (
    <div style={tooltipStyle}>
      <p style={{ color: 'var(--text4)', marginBottom: 6, fontSize: 11 }}>Year {label}</p>
      <p style={{ color: 'var(--text3)', margin: '2px 0' }}>Invested: <span style={{ color: 'var(--text2)', fontWeight: 700 }}>{formatINR(invested)}</span></p>
      <p style={{ color: '#7fb069', margin: '2px 0' }}>Corpus: <span style={{ fontWeight: 700 }}>{formatINR(corpus)}</span></p>
      {corpus && invested && (
        <p style={{ color: '#e0aa3e', margin: '2px 0' }}>Returns: <span style={{ fontWeight: 700 }}>{formatINR(corpus - invested)}</span></p>
      )}
    </div>
  )
}

export default function SIPAreaChart({ data = [], crossoverYear }) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7fb069" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#7fb069" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5a544a" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#5a544a" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border3)" />
        <XAxis dataKey="year" tickFormatter={y => `Yr ${y}`} tick={{ fontSize: 11, fill: 'var(--text4)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => formatINR(v)} tick={{ fontSize: 10, fill: 'var(--text4)' }} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<CustomTooltip />} />
        {crossoverYear && (
          <ReferenceLine x={crossoverYear} stroke="#e0aa3e" strokeDasharray="4 4"
            label={{ value: 'Returns > Invested', fill: '#e0aa3e', fontSize: 10, position: 'top' }} />
        )}
        <Area type="monotone" dataKey="corpus"   stroke="#7fb069" strokeWidth={2} fill="url(#corpusGrad)"   name="Corpus" />
        <Area type="monotone" dataKey="invested" stroke="#5a544a" strokeWidth={2} fill="url(#investedGrad)" name="Invested" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
