import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RiskBadge } from '../components/ui/Navbar'
import { Sparkles, TrendingUp, Shield, Target, Zap, ArrowUpRight } from 'lucide-react'
import api from '../utils/api'
import { COLORS, tooltipStyle } from '../utils/theme'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const RISK_META = {
  Conservative: { icon: '🛡️', tagline: 'Safety first — steady, low-risk growth', color: '#7fb069' },
  Moderate:     { icon: '⚖️', tagline: 'Balanced growth with managed risk',       color: '#e0aa3e' },
  Aggressive:   { icon: '🚀', tagline: 'Maximum growth over the long term',        color: '#e7625f' },
}

const CAT_INFO = {
  'Large Cap':     { tip: "India's top 100 companies — stable" },
  'Mid Cap':       { tip: 'Ranks 101–250 — higher growth potential' },
  'Small Cap':     { tip: 'Ranks 251+ — high risk, high reward' },
  'Flexi Cap':     { tip: 'Invests across all company sizes' },
  'ELSS':          { tip: 'Tax-saver under Sec 80C — 3yr lock-in' },
  'Index':         { tip: 'Tracks Nifty/Sensex — lowest cost' },
  'Thematic':      { tip: 'Sector-specific focused bet' },
  'Multi Cap':     { tip: 'Balanced across all sizes' },
  'Balanced Advantage': { tip: 'Auto-adjusts equity and debt' },
}

const QUICK = [
  { to: '/compare',    icon: <TrendingUp size={18} />, label: 'Compare Funds',   sub: 'NAV charts side-by-side' },
  { to: '/calculator', icon: <Target size={18} />,     label: 'SIP Calculator', sub: 'Plan your monthly SIP' },
  { to: '/overlap',   icon: <Zap size={18} />,         label: 'Overlap Check',  sub: 'Find duplicate holdings' },
  { to: '/funds',     icon: <Shield size={18} />,      label: 'Browse 987 Funds', sub: 'All direct plan funds' },
]

function RecCard({ rec, idx }) {
  const c = COLORS[idx % COLORS.length]
  const name = rec.scheme_name?.split(' - ')[0] || `Fund ${rec.scheme_code}`
  const cat = CAT_INFO[rec.category] || { tip: rec.category }

  return (
    <div className="card-rise" style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 18, padding: 20, animationDelay: `${idx * 80}ms` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: c + '22', border: `1px solid ${c}44`, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 800, color: c, flexShrink: 0 }}>
          {idx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/fund/${rec.scheme_code}`} style={{ fontWeight: 700, fontSize: 14, color: '#e8e2d4', textDecoration: 'none', display: 'block', lineHeight: 1.4 }}
            onMouseEnter={e => e.target.style.color = c} onMouseLeave={e => e.target.style.color = '#e8e2d4'}>
            {name}
          </Link>
          <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, background: c + '18', color: c, borderRadius: 6, padding: '3px 8px', fontWeight: 700 }}>{rec.category}</span>
            <span style={{ fontSize: 10, color: '#5a544a' }}>ⓘ {cat.tip}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: c, lineHeight: 1 }}>{rec.allocation_pct}%</div>
          <div style={{ fontSize: 10, color: '#5a544a', marginTop: 2 }}>allocation</div>
        </div>
      </div>

      <div style={{ height: 3, background: '#1a1610', borderRadius: 2, marginBottom: 14 }}>
        <div style={{ width: `${rec.allocation_pct}%`, height: '100%', background: c, borderRadius: 2 }} />
      </div>

      <p style={{ fontSize: 13, color: '#c9c2b4', lineHeight: 1.6, marginBottom: 14 }}>💡 {rec.reason}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[['1Y Return', rec.returns_1y], ['3Y Return', rec.returns_3y], ['Exp. Ratio', rec.expense_ratio ? rec.expense_ratio + '%' : null]].map(([label, val]) => (
          <div key={label} style={{ background: '#0d0b07', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: label.includes('Ratio') ? '#c9c2b4' : val != null && val >= 0 ? '#7fb069' : '#e7625f' }}>
              {val != null ? (typeof val === 'number' && !label.includes('Ratio') ? `${val > 0 ? '+' : ''}${val}%` : val) : '—'}
            </div>
            <div style={{ fontSize: 10, color: '#5a544a', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { sessionId, riskProfile, quizResult, recommendations, setRecommendations } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!riskProfile) { navigate('/quiz'); return }
    if (recommendations || !quizResult) return
    setLoading(true)
    api.post('/api/ai/recommendations', {
      session_id: sessionId,
      risk_profile: quizResult.risk_profile,
      investment_goal: quizResult.investment_goal,
      horizon_years: quizResult.horizon_years,
      monthly_budget: 5000,
    }).then(r => { setRecommendations(r.data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [riskProfile])

  if (!riskProfile) return null
  const meta = RISK_META[riskProfile] || RISK_META.Moderate
  const recs = recommendations?.recommendations || []
  const pieData = recs.map((r, i) => ({ name: r.scheme_name?.split(' - ')[0]?.slice(0, 20), value: r.allocation_pct, color: COLORS[i % COLORS.length] }))

  return (
    <div style={{ padding: '28px 24px 60px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>

      {/* Glow */}
      <div style={{ position: 'fixed', top: -200, right: -100, width: 500, height: 500, background: 'radial-gradient(circle,rgba(224,170,62,.06),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Profile card */}
      <div className="card-rise" style={{ background: 'linear-gradient(160deg,#16130d,#110e09)', border: `1px solid ${meta.color}30`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{meta.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: '#5a544a', letterSpacing: '1px', textTransform: 'uppercase' }}>Your investor profile</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif' }}>{riskProfile} Investor</div>
          </div>
          <RiskBadge profile={riskProfile} size="lg" />
        </div>
        <p style={{ fontSize: 13, color: '#8a8174', margin: '0 0 14px' }}>{meta.tagline}</p>
        {quizResult && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[`🎯 ${quizResult.investment_goal}`, `📅 ${quizResult.horizon_years}-year horizon`].map(t => (
              <span key={t} style={{ fontSize: 11, background: 'rgba(224,170,62,.08)', border: '1px solid rgba(224,170,62,.15)', color: '#e0aa3e', borderRadius: 999, padding: '5px 12px', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/quiz')} style={{ marginTop: 12, fontSize: 11, color: '#5a544a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retake quiz</button>
      </div>

      {/* AI Picks header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e2d4', margin: 0, fontFamily: 'Georgia, serif' }}>Your AI-Curated Portfolio</h2>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, background: '#e0aa3e', color: '#0d0b07', fontWeight: 800, padding: '4px 10px', borderRadius: 999, letterSpacing: '.5px' }}>
          <Sparkles size={11} /> AI
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#5a544a', marginBottom: 20 }}>
        Personalized for your {riskProfile?.toLowerCase()} profile · {quizResult?.investment_goal} goal
      </p>

      {/* Loading */}
      {loading && (
        <div style={{ background: 'linear-gradient(160deg,#16130d,#110e09)', border: '1px solid #25211a', borderRadius: 18, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🧠</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e2d4', fontFamily: 'Georgia, serif' }}>Analyzing 987 funds for you…</div>
          <div style={{ fontSize: 12, color: '#5a544a', marginTop: 6 }}>Usually takes about 10 seconds</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#e0aa3e', animation: 'rise .6s ease-in-out infinite alternate', animationDelay: `${i*200}ms` }} />)}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ background: '#1a0f0f', border: '1px solid #5a2020', borderRadius: 18, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e7625f' }}>Could not load recommendations</div>
          <div style={{ fontSize: 12, color: '#8a8174', marginTop: 4 }}>{error}</div>
        </div>
      )}

      {/* Recs */}
      {recs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary */}
          {recommendations.ai_summary && (
            <div className="card-rise" style={{ background: 'rgba(224,170,62,.06)', border: '1px solid rgba(224,170,62,.15)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <p style={{ fontSize: 13, color: '#c9c2b4', lineHeight: 1.65, margin: 0 }}>{recommendations.ai_summary}</p>
              </div>
            </div>
          )}

          {/* Allocation overview */}
          <div className="card-rise" style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 120, height: 120, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={2} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#5a544a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Suggested Allocation</div>
              {recs.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 4, background: '#1a1610', borderRadius: 2 }}>
                    <div style={{ width: `${r.allocation_pct}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#c9c2b4', width: 28, textAlign: 'right', fontWeight: 700 }}>{r.allocation_pct}%</span>
                  <span style={{ fontSize: 11, color: '#8a8174', flex: 2 }}>{r.scheme_name?.split(' - ')[0]?.slice(0, 28)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual cards */}
          {recs.map((rec, i) => <RecCard key={rec.scheme_code} rec={rec} idx={i} />)}

          <div style={{ textAlign: 'center', fontSize: 11, color: '#3a352c', paddingTop: 4 }}>
            ⚠️ Educational only — consult a SEBI-registered advisor before investing
          </div>
        </div>
      )}

      {/* No quiz result fallback */}
      {!loading && !recommendations && !error && (
        <div style={{ background: 'linear-gradient(160deg,#16130d,#110e09)', border: '2px dashed #25211a', borderRadius: 18, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e2d4', fontFamily: 'Georgia, serif' }}>No recommendations yet</div>
          <div style={{ fontSize: 12, color: '#5a544a', marginTop: 6, marginBottom: 20 }}>Complete the quiz to get your personalized AI picks</div>
          <button onClick={() => navigate('/quiz')} style={{ background: '#e0aa3e', color: '#0d0b07', border: 'none', borderRadius: 11, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Take the Quiz →
          </button>
        </div>
      )}

      {/* What next */}
      {recs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif', marginBottom: 12 }}>What would you like to do next?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {QUICK.map((q, i) => (
              <Link key={i} to={q.to} style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 14, padding: 16, textDecoration: 'none', display: 'block', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e0aa3e44'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#25211a'}>
                <div style={{ color: '#e0aa3e', marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8e2d4', marginBottom: 3 }}>{q.label}</div>
                <div style={{ fontSize: 11, color: '#5a544a' }}>{q.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
