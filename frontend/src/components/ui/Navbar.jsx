import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { Activity, Sun, Moon } from 'lucide-react'

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/funds',      label: 'Funds'     },
  { to: '/compare',    label: 'Compare'   },
  { to: '/overlap',    label: 'Overlap'   },
  { to: '/calculator', label: 'SIP'       },
]

export default function Navbar() {
  const { riskProfile } = useApp()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()

  return (
    <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40, transition: 'background .2s, border-color .2s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#f0c14b,#d99a4e)', display: 'grid', placeItems: 'center', boxShadow: '0 2px 12px rgba(224,170,62,.3)' }}>
            <Activity size={16} strokeWidth={2.5} color="#0d0b07" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text)', fontFamily: 'Georgia, serif' }}>
            MUTUAL<span style={{ color: 'var(--amber)' }}>MIND</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? 'var(--amber)' : 'var(--text3)', textDecoration: 'none',
                background: active ? 'color-mix(in srgb, var(--amber) 8%, transparent)' : 'transparent',
                transition: 'all .15s',
              }}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: risk badge + theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {riskProfile ? (
            <RiskBadge profile={riskProfile} />
          ) : (
            <Link to="/quiz" style={{ background: 'var(--amber)', color: 'var(--on-accent)', fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 8, textDecoration: 'none', letterSpacing: '.3px' }}>
              Take Quiz
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card-inner, var(--bg))', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text3)', transition: 'all .15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export function RiskBadge({ profile, size = 'sm' }) {
  const colors = { Conservative: '#7fb069', Moderate: '#e0aa3e', Aggressive: '#e7625f' }
  const c = colors[profile] || 'var(--text3)'
  return (
    <span style={{ fontSize: size === 'lg' ? 13 : 11, fontWeight: 700, padding: size === 'lg' ? '6px 14px' : '4px 10px', borderRadius: 999, border: `1px solid ${c}40`, color: c, background: `${c}12` }}>
      {profile}
    </span>
  )
}
