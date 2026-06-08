import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { RiskBadge } from '../ui/Navbar'
import { COLORS, tooltipStyle } from '../../utils/theme'

export default function RecommendationCard({ recommendations = [], aiSummary = '' }) {
  if (!recommendations.length) return null

  const pieData = recommendations.map((r, i) => ({
    name: r.scheme_name?.split(' - ')[0]?.slice(0, 20),
    value: r.allocation_pct,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div style={{ background: 'var(--panel-grad)', border: '1px solid var(--border)', borderRadius: 18, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', margin: 0 }}>AI Recommendations</h3>
      </div>
      {aiSummary && (
        <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.65 }}>{aiSummary}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Allocation donut */}
        <div style={{ width: '100%', maxWidth: 200 }}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fund list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recommendations.map((rec, i) => (
            <div key={rec.scheme_code} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <Link to={`/fund/${rec.scheme_code}`} style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rec.scheme_name?.split(' - ')[0]}
                  </Link>
                  <span style={{ fontSize: 12, fontWeight: 800, color: COLORS[i % COLORS.length], flexShrink: 0 }}>{rec.allocation_pct}%</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text4)', lineHeight: 1.5, margin: '0 0 6px' }}>{rec.reason}</p>
                <div style={{ height: 3, background: 'var(--card-inner)', borderRadius: 2 }}>
                  <div style={{ width: `${rec.allocation_pct}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border3)' }}>
        AI suggestions are educational only. Consult a SEBI-registered advisor before investing.
      </p>
    </div>
  )
}
