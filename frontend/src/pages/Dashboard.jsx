import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RiskBadge } from '../components/ui/Navbar'
import RecommendationCard from '../components/ai/RecommendationCard'
import { CardSkeleton } from '../components/ui/LoadingSkeleton'
import api from '../utils/api'

const RISK_PROFILE_META = {
  Conservative: {
    color: 'from-emerald-600 to-teal-700',
    categories: ['Large Cap', 'Index', 'Balanced Advantage'],
    description: 'Capital preservation with steady growth. Focus on blue-chip and index funds.',
  },
  Moderate: {
    color: 'from-amber-500 to-orange-600',
    categories: ['Flexi Cap', 'Large & Mid Cap', 'Aggressive Hybrid'],
    description: 'Balanced growth with managed volatility. Mix of large and mid-cap exposure.',
  },
  Aggressive: {
    color: 'from-indigo-600 to-violet-700',
    categories: ['Mid Cap', 'Small Cap', 'Thematic', 'ELSS'],
    description: 'High growth with high risk. Suited for 10+ year horizons.',
  },
}

const QUICK_ACTIONS = [
  { to: '/compare',    icon: '📊', title: 'Compare Funds',       desc: 'Side-by-side indexed NAV charts' },
  { to: '/overlap',   icon: '🔵', title: 'Portfolio Overlap',    desc: 'Find shared stock exposure' },
  { to: '/calculator', icon: '🎯', title: 'SIP Calculator',      desc: 'Plan for any financial goal' },
  { to: '/funds',     icon: '📋', title: 'Browse All Funds',    desc: '987 direct plan funds' },
]

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

  const meta = RISK_PROFILE_META[riskProfile] || RISK_PROFILE_META.Moderate

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Profile banner */}
      <div className={`bg-linear-to-r ${meta.color} rounded-2xl p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Your investor profile</p>
            <h1 className="text-3xl font-extrabold mb-1">{riskProfile} Investor</h1>
            <p className="text-white/80 text-sm max-w-md">{meta.description}</p>
            {quizResult && (
              <div className="flex gap-4 mt-3">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  🎯 {quizResult.investment_goal}
                </span>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ⏱ {quizResult.horizon_years} year horizon
                </span>
              </div>
            )}
          </div>
          <RiskBadge profile={riskProfile} size="lg" />
        </div>

        {/* Suggested categories */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-2">Suggested fund categories for you</p>
          <div className="flex flex-wrap gap-2">
            {meta.categories.map(c => (
              <Link key={c} to={`/funds?category=${encodeURIComponent(c)}`}
                className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                {c} →
              </Link>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/quiz')} className="mt-3 text-xs text-white/50 hover:text-white/80 transition-colors">
          Retake quiz
        </button>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(card => (
            <Link key={card.to} to={card.to}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all group text-center">
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="font-semibold text-slate-800 text-xs group-hover:text-indigo-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug hidden sm:block">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-700">AI Picks for You</h2>
          {recommendations && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Powered by Groq · llama-3.3-70b
            </span>
          )}
        </div>

        {loadingRecs && (
          <div className="space-y-3">
            <CardSkeleton />
            <p className="text-center text-sm text-slate-400 animate-pulse">
              AI is analyzing your profile against 987 funds…
            </p>
          </div>
        )}
        {recsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            Could not load recommendations: {recsError}
          </div>
        )}
        {recommendations && (
          <RecommendationCard
            recommendations={recommendations.recommendations}
            aiSummary={recommendations.ai_summary}
          />
        )}
        {!loadingRecs && !recommendations && !recsError && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-sm">
            Retake the quiz to generate AI recommendations
          </div>
        )}
      </div>
    </div>
  )
}
