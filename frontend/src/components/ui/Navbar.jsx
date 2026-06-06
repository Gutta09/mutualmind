import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/compare', label: 'Compare' },
  { to: '/overlap', label: 'Overlap' },
  { to: '/calculator', label: 'SIP Calc' },
]

export default function Navbar() {
  const { riskProfile } = useApp()
  const { pathname } = useLocation()

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-bold text-indigo-600 text-lg tracking-tight">
          MutualMind
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {riskProfile && (
            <RiskBadge profile={riskProfile} />
          )}
          {!riskProfile && (
            <Link
              to="/quiz"
              className="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export function RiskBadge({ profile, size = 'sm' }) {
  const colors = {
    Conservative: 'bg-emerald-100 text-emerald-800',
    Moderate: 'bg-amber-100 text-amber-800',
    Aggressive: 'bg-red-100 text-red-800',
  }
  const sz = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`${sz} rounded-full font-semibold ${colors[profile] || 'bg-slate-100 text-slate-700'}`}>
      {profile}
    </span>
  )
}
