import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import api from '../utils/api'

const RISK_META = {
  Conservative: {
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    emoji: '🛡️',
    tagline: 'Safety first — steady, low-risk growth',
    suggestion: 'Large Cap, Index, and Balanced funds are your sweet spot.',
  },
  Moderate: {
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    emoji: '⚖️',
    tagline: 'Balanced growth with managed risk',
    suggestion: 'Flexi Cap and Large & Mid Cap funds work well for you.',
  },
  Aggressive: {
    gradient: 'from-violet-600 to-purple-700',
    lightBg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    emoji: '🚀',
    tagline: 'Maximum growth over the long term',
    suggestion: 'Mid Cap, Small Cap, and ELSS funds are your best bet.',
  },
}

const CATEGORY_INFO = {
  'Large Cap':     { emoji: '🏢', color: 'bg-blue-100 text-blue-800',    tip: "India's top 100 companies" },
  'Mid Cap':       { emoji: '📈', color: 'bg-violet-100 text-violet-800', tip: 'Companies ranked 101–250' },
  'Small Cap':     { emoji: '🌱', color: 'bg-rose-100 text-rose-800',    tip: 'High growth, high risk' },
  'Flexi Cap':     { emoji: '🔄', color: 'bg-indigo-100 text-indigo-800', tip: 'Invests across all sizes' },
  'ELSS':          { emoji: '💰', color: 'bg-teal-100 text-teal-800',    tip: 'Saves tax under Sec 80C' },
  'Index':         { emoji: '📊', color: 'bg-cyan-100 text-cyan-800',    tip: 'Tracks Nifty/Sensex' },
  'Thematic':      { emoji: '🎯', color: 'bg-orange-100 text-orange-800', tip: 'Sector-specific bet' },
  'Multi Cap':     { emoji: '🧩', color: 'bg-purple-100 text-purple-800', tip: 'Balanced across all sizes' },
  'Balanced Advantage': { emoji: '⚖️', color: 'bg-amber-100 text-amber-800', tip: 'Auto-adjusts equity/debt' },
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6']

function AllocationBar({ recs }) {
  return (
    <div className="rounded-xl overflow-hidden h-3 flex w-full">
      {recs.map((r, i) => (
        <div
          key={i}
          style={{ width: `${r.allocation_pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
          title={`${r.scheme_name?.split(' - ')[0]} — ${r.allocation_pct}%`}
        />
      ))}
    </div>
  )
}

function RecCard({ rec, index }) {
  const catInfo = CATEGORY_INFO[rec.category] || { emoji: '📋', color: 'bg-slate-100 text-slate-700', tip: rec.category }
  const color = COLORS[index % COLORS.length]
  const fundName = rec.scheme_name?.split(' - ')[0] || `Fund ${rec.scheme_code}`

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: color }}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/fund/${rec.scheme_code}`}
            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm leading-snug block">
            {fundName}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catInfo.color}`}>
              {catInfo.emoji} {rec.category}
            </span>
            <span className="text-xs text-slate-400" title={catInfo.tip}>ⓘ {catInfo.tip}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold" style={{ color }}>{rec.allocation_pct}%</div>
          <div className="text-xs text-slate-400">allocation</div>
        </div>
      </div>

      {/* Allocation bar */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-3">
        <div className="h-full rounded-full" style={{ width: `${rec.allocation_pct}%`, backgroundColor: color }} />
      </div>

      {/* Why this fund */}
      <p className="text-sm text-slate-600 leading-relaxed mb-3">💡 {rec.reason}</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3">
        <div>
          <div className={`text-sm font-bold ${rec.returns_1y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {rec.returns_1y != null ? `${rec.returns_1y > 0 ? '+' : ''}${rec.returns_1y}%` : '—'}
          </div>
          <div className="text-xs text-slate-400">1Y Return</div>
        </div>
        <div>
          <div className={`text-sm font-bold ${(rec.returns_3y || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {rec.returns_3y != null ? `${rec.returns_3y > 0 ? '+' : ''}${rec.returns_3y}%` : '—'}
          </div>
          <div className="text-xs text-slate-400">3Y Return</div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-700">
            {rec.expense_ratio != null ? `${rec.expense_ratio}%` : '—'}
          </div>
          <div className="text-xs text-slate-400">Exp. Ratio</div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { sessionId, riskProfile, quizResult, recommendations, setRecommendations } = useApp()
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [recsError, setRecsError] = useState(null)

  useEffect(() => {
    if (!riskProfile) { navigate('/quiz'); return }
    if (recommendations) return
    if (!quizResult) return
    setLoadingRecs(true)
    api.post('/api/ai/recommendations', {
      session_id: sessionId,
      risk_profile: quizResult.risk_profile,
      investment_goal: quizResult.investment_goal,
      horizon_years: quizResult.horizon_years,
      monthly_budget: 5000,
    })
      .then(r => { setRecommendations(r.data); setLoadingRecs(false) })
      .catch(e => { setRecsError(e.message); setLoadingRecs(false) })
  }, [riskProfile])

  if (!riskProfile) return null
  const meta = RISK_META[riskProfile] || RISK_META.Moderate
  const recs = recommendations?.recommendations || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Profile card */}
      <div className={`bg-linear-to-r ${meta.gradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <div className="text-white/70 text-sm">Your investor profile</div>
            <div className="text-2xl font-extrabold">{riskProfile} Investor</div>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-3">{meta.tagline}</p>
        {quizResult && (
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              🎯 Goal: {quizResult.investment_goal}
            </span>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              📅 {quizResult.horizon_years}-year horizon
            </span>
          </div>
        )}
        <button onClick={() => navigate('/quiz')}
          className="mt-3 text-xs text-white/50 hover:text-white/80 transition-colors underline">
          Retake quiz
        </button>
      </div>

      {/* AI Picks section */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-slate-900">Your AI-Curated Portfolio</h2>
          <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full">AI</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Personalized picks based on your {riskProfile?.toLowerCase()} risk profile and {quizResult?.investment_goal} goal.
        </p>

        {/* Loading */}
        {loadingRecs && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3 animate-bounce">🧠</div>
            <p className="font-semibold text-slate-700">Analyzing 987 funds for you…</p>
            <p className="text-sm text-slate-400 mt-1">This takes about 10 seconds</p>
            <div className="mt-4 flex gap-1.5 justify-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {recsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-red-700 mb-1">Could not load recommendations</p>
            <p className="text-xs text-red-500">{recsError}</p>
            <button onClick={() => { setRecsError(null); setLoadingRecs(false) }}
              className="mt-3 text-xs text-indigo-600 underline">Try again</button>
          </div>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <div className="space-y-4">
            {/* AI Summary */}
            {recommendations.ai_summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex gap-2">
                  <span className="text-indigo-500 text-lg shrink-0">🤖</span>
                  <p className="text-sm text-indigo-900 leading-relaxed">{recommendations.ai_summary}</p>
                </div>
              </div>
            )}

            {/* Allocation bar overview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Suggested Allocation</p>
              <AllocationBar recs={recs} />
              <div className="flex flex-wrap gap-3 mt-3">
                {recs.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-600">{r.scheme_name?.split(' - ')[0]?.slice(0, 25)}… <span className="font-bold">{r.allocation_pct}%</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual rec cards */}
            {recs.map((rec, i) => <RecCard key={rec.scheme_code} rec={rec} index={i} />)}

            <p className="text-xs text-slate-400 text-center pt-1">
              ⚠️ AI suggestions are for education only. Consult a SEBI-registered advisor before investing.
            </p>
          </div>
        )}

        {/* No quiz result */}
        {!loadingRecs && !recommendations && !recsError && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <p className="font-semibold text-slate-700">No recommendations yet</p>
            <p className="text-sm text-slate-400 mt-1">Complete the quiz to get personalized AI picks</p>
            <button onClick={() => navigate('/quiz')}
              className="mt-4 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Take the Quiz
            </button>
          </div>
        )}
      </div>

      {/* What to do next */}
      {recs.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3">What would you like to do next?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recs.length >= 2 && (
              <Link to={`/compare?codes=${recs.slice(0,2).map(r=>r.scheme_code).join(',')}`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-semibold text-sm text-slate-800 group-hover:text-indigo-700">Compare These Funds</div>
                <div className="text-xs text-slate-400 mt-0.5">Side-by-side NAV chart</div>
              </Link>
            )}
            <Link to="/calculator"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-semibold text-sm text-slate-800 group-hover:text-indigo-700">Plan My SIP</div>
              <div className="text-xs text-slate-400 mt-0.5">How much to invest monthly</div>
            </Link>
            <Link to="/funds"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
              <div className="text-2xl mb-1">📋</div>
              <div className="font-semibold text-sm text-slate-800 group-hover:text-indigo-700">Browse All Funds</div>
              <div className="text-xs text-slate-400 mt-0.5">987 funds to explore</div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
