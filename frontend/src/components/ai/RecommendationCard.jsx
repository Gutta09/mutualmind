import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { RiskBadge } from '../ui/Navbar'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6']

export default function RecommendationCard({ recommendations = [], aiSummary = '' }) {
  if (!recommendations.length) return null

  const pieData = recommendations.map((r, i) => ({
    name: r.scheme_name?.split(' - ')[0]?.slice(0, 20),
    value: r.allocation_pct,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🤖</span>
        <h3 className="font-semibold text-slate-800">AI Recommendations</h3>
      </div>
      {aiSummary && (
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{aiSummary}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Allocation donut */}
        <div className="w-full md:w-48 shrink-0">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fund list */}
        <div className="flex-1 space-y-3">
          {recommendations.map((rec, i) => (
            <div key={rec.scheme_code} className="flex items-start gap-3">
              <div
                className="w-3 h-3 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link
                    to={`/fund/${rec.scheme_code}`}
                    className="text-sm font-semibold text-slate-800 hover:text-indigo-600 truncate"
                  >
                    {rec.scheme_name?.split(' - ')[0]}
                  </Link>
                  <span className="text-xs font-bold text-indigo-600 shrink-0">{rec.allocation_pct}%</span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{rec.reason}</p>
                {/* Allocation bar */}
                <div className="h-1 bg-slate-100 rounded mt-1.5">
                  <div
                    className="h-full rounded transition-all"
                    style={{ width: `${rec.allocation_pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
        AI suggestions are educational only. Consult a SEBI-registered advisor before investing.
      </p>
    </div>
  )
}
