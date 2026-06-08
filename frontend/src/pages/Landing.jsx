import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const STATS = [
  { value: '900+', label: 'Funds tracked' },
  { value: '15+', label: 'Years of NAV data' },
  { value: 'Free', label: 'No account needed' },
]

const DIFFERENTIATORS = [
  {
    icon: '🔵',
    title: 'Portfolio Overlap',
    highlight: 'No other free tool has this',
    desc: 'See exactly which stocks your funds share. Stop accidentally doubling your Reliance or HDFC Bank exposure.',
  },
  {
    icon: '📊',
    title: 'Indexed NAV Charts',
    highlight: 'Raw NAV is misleading',
    desc: 'We normalize all funds to a base of 100 so you compare actual returns — not rupee prices that mean nothing side-by-side.',
  },
  {
    icon: '🧠',
    title: 'AI in Plain English',
    highlight: 'Not star ratings — reasoning',
    desc: 'Groq AI reads your risk profile and explains in one sentence why each fund fits you. No jargon.',
  },
  {
    icon: '📰',
    title: 'News Sentiment',
    highlight: 'Linked to actual holdings',
    desc: "We analyze news about your fund's top holdings — not generic AMC press releases. Bullish/Bearish/Neutral, scored per article.",
  },
]

export default function Landing() {
  const { riskProfile } = useApp()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="font-bold text-lg tracking-tight text-white">
          Mutual<span className="text-indigo-400">Mind</span>
        </span>
        <div className="flex gap-3">
          <Link to="/funds" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
            Browse Funds
          </Link>
          {riskProfile ? (
            <Link to="/dashboard" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg font-medium transition-colors">
              Dashboard →
            </Link>
          ) : (
            <Link to="/quiz" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg font-medium transition-colors">
              Start Free →
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-powered · Indian Mutual Funds · 100% Free
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
          Research mutual funds
          <br />
          <span className="text-indigo-400">the way professionals do</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Compare normalized performance, visualize portfolio overlap, get AI-driven fund picks
          tailored to your risk profile — all in one place, no account needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          {riskProfile ? (
            <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-indigo-900">
              Go to Dashboard →
            </Link>
          ) : (
            <Link to="/quiz" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-indigo-900">
              Get My Fund Picks (2 min) →
            </Link>
          )}
          <Link to="/funds" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base border border-slate-700">
            Browse 900+ Funds
          </Link>
        </div>

        {/* Stats bar */}
        <div className="inline-flex gap-8 border border-slate-800 bg-slate-900 rounded-2xl px-8 py-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why different section */}
      <div className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">Why MutualMind</p>
            <h2 className="text-3xl font-bold text-white">
              What no other free Indian MF tool does
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DIFFERENTIATORS.map(d => (
              <div key={d.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-indigo-700 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{d.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">{d.title}</h3>
                      <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-medium">
                        {d.highlight}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to invest smarter?</h2>
          <p className="text-slate-400 mb-8">Take a 2-minute quiz. Get a personalized risk profile and AI-curated fund picks instantly.</p>
          {riskProfile ? (
            <Link to="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-base">
              Go to Dashboard →
            </Link>
          ) : (
            <Link to="/quiz" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-base">
              Start Risk Quiz →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
