import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/funds',     label: 'Funds',     icon: '📋' },
  { to: '/compare',  label: 'Compare',   icon: '📊' },
  { to: '/overlap',  label: 'Overlap',   icon: '🔵' },
  { to: '/calculator', label: 'SIP Calc', icon: '🎯' },
]

export default function Navbar() {
  const { riskProfile } = useApp()
  const { pathname } = useLocation()

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-extrabold text-slate-900 text-lg tracking-tight">
          Mutual<span className="text-indigo-600">Mind</span>
        </Link>

        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith(link.to)
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sm:hidden">{link.icon}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {riskProfile ? (
            <RiskBadge profile={riskProfile} />
          ) : (
            <Link to="/quiz"
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              Take Quiz
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export function RiskBadge({ profile, size = 'sm' }) {
  const styles = {
    Conservative: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Moderate:     'bg-amber-50 text-amber-700 border border-amber-200',
    Aggressive:   'bg-red-50 text-red-700 border border-red-200',
  }
  const sz = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-1 text-xs'
  return (
    <span className={`${sz} rounded-full font-semibold ${styles[profile] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
      {profile}
    </span>
  )
}
