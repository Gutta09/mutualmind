import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Powered Recommendations',
    desc: 'Claude analyzes your risk profile and goals to suggest the right fund categories — in plain English.',
  },
  {
    icon: '📊',
    title: 'Fund Comparator',
    desc: 'Compare up to 3 funds side-by-side with indexed NAV charts and a color-coded returns table.',
  },
  {
    icon: '🔵',
    title: 'Portfolio Overlap Visualizer',
    desc: 'See exactly which stocks your funds share — so you\'re not unknowingly doubling down.',
  },
  {
    icon: '🎯',
    title: 'SIP Goal Planner',
    desc: 'Enter a financial goal and timeline — get the monthly SIP you need with a corpus growth chart.',
  },
  {
    icon: '📰',
    title: 'News Sentiment',
    desc: 'Latest news for a fund\'s top holdings, scored bullish / bearish / neutral by AI.',
  },
]

export default function Landing() {
  const { riskProfile } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span>✨</span> AI-powered · Free · No account needed
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-4">
          Invest smarter with
          <span className="text-indigo-600"> MutualMind</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Research Indian mutual funds the right way. Compare performance, visualize overlap, calculate SIPs,
          and get personalized AI recommendations — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {riskProfile ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-base shadow-md shadow-indigo-200"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              to="/quiz"
              className="bg-indigo-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-base shadow-md shadow-indigo-200"
            >
              Start Risk Quiz (2 min) →
            </Link>
          )}
          <Link
            to="/compare"
            className="bg-white text-slate-700 font-semibold px-7 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-base"
          >
            Compare Funds
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
