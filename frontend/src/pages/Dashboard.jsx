import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RiskBadge } from '../components/ui/Navbar'
import RecommendationCard from '../components/ai/RecommendationCard'
import { CardSkeleton } from '../components/ui/LoadingSkeleton'
import api from '../utils/api'

const MODULE_CARDS = [
  { to: '/compare', icon: '📊', title: 'Fund Comparator', desc: 'Compare up to 3 funds with indexed NAV charts and a returns table.' },
  { to: '/overlap', icon: '🔵', title: 'Portfolio Overlap', desc: 'Venn diagram showing shared stock holdings across your funds.' },
  { to: '/calculator', icon: '🎯', title: 'SIP Calculator', desc: 'Calculate monthly SIP needed for any financial goal.' },
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Profile header */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm mb-1">Your investor profile</p>
            <h1 className="text-2xl font-bold mb-2">{riskProfile} Investor</h1>
            {quizResult && (
              <p className="text-indigo-100 text-sm">
                Goal: <span className="font-semibold">{quizResult.investment_goal}</span>
                {' · '}Horizon: <span className="font-semibold">{quizResult.horizon_years} years</span>
              </p>
            )}
          </div>
          <RiskBadge profile={riskProfile} size="lg" />
        </div>
        <button
          onClick={() => navigate('/quiz')}
          className="mt-4 text-xs text-indigo-200 hover:text-white underline"
        >
          Retake quiz
        </button>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MODULE_CARDS.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors mb-1">
              {card.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">AI Picks for You</h2>
        {loadingRecs && (
          <div className="space-y-3">
            <CardSkeleton />
            <p className="text-center text-sm text-slate-400 animate-pulse">Claude is analyzing your profile...</p>
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
      </div>
    </div>
  )
}
