import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { formatINR } from '../../utils/sipMath'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const corpus = payload.find(p => p.dataKey === 'corpus')?.value
  const invested = payload.find(p => p.dataKey === 'invested')?.value
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs space-y-1">
      <p className="text-slate-500 font-medium">Year {label}</p>
      <p className="text-slate-600">Invested: <span className="font-semibold text-slate-800">{formatINR(invested)}</span></p>
      <p className="text-emerald-600">Corpus: <span className="font-semibold">{formatINR(corpus)}</span></p>
      {corpus && invested && (
        <p className="text-indigo-600">Returns: <span className="font-semibold">{formatINR(corpus - invested)}</span></p>
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
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="year"
          tickFormatter={y => `Yr ${y}`}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => formatINR(v)}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        {crossoverYear && (
          <ReferenceLine
            x={crossoverYear}
            stroke="#6366f1"
            strokeDasharray="4 4"
            label={{ value: 'Returns > Invested', fill: '#6366f1', fontSize: 10, position: 'top' }}
          />
        )}
        <Area
          type="monotone"
          dataKey="corpus"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#corpusGrad)"
          name="Corpus"
        />
        <Area
          type="monotone"
          dataKey="invested"
          stroke="#94a3b8"
          strokeWidth={2}
          fill="url(#investedGrad)"
          name="Invested"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
