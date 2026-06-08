import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Sparkles, TrendingUp, BarChart2, Calculator, Shield, ArrowRight, Activity } from 'lucide-react'

const DIFFERENTIATORS = [
  { icon: <BarChart2 size={20} />, title: 'Portfolio Overlap', highlight: 'No other free tool does this', desc: 'See exactly which stocks your funds share. Stop accidentally doubling your Reliance or HDFC Bank exposure.' },
  { icon: <TrendingUp size={20} />, title: 'Indexed NAV Charts', highlight: 'Raw NAV is misleading', desc: 'We normalize all funds to a base of 100 so you compare actual returns — not rupee prices that mean nothing side-by-side.' },
  { icon: <Sparkles size={20} />, title: 'AI in Plain English', highlight: 'Not star ratings — reasoning', desc: 'Groq AI reads your risk profile and explains in one sentence why each fund fits you. No jargon.' },
  { icon: <Shield size={20} />, title: 'News Sentiment', highlight: 'Linked to actual holdings', desc: "We analyze news about your fund's top holdings — not generic AMC press releases. Bullish/Bearish/Neutral, scored per article." },
]

const STATS = [
  { val: '987', label: 'Direct-Plan Funds' },
  { val: 'AI', label: 'Groq-Powered Picks' },
  { val: '5', label: 'Funds Compared' },
  { val: 'Free', label: 'No Account Needed' },
]

export default function Landing() {
  const { riskProfile } = useApp()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: -300, left: '50%', transform: 'translateX(-50%)', width: 900, height: 700, background: 'radial-gradient(ellipse,rgba(224,170,62,.065),transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="card-rise">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(224,170,62,.1)', border: '1px solid rgba(224,170,62,.2)', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#e0aa3e', fontWeight: 700, marginBottom: 28, letterSpacing: '.5px' }}>
            <Activity size={11} /> AI-POWERED · INDIAN MUTUAL FUNDS · 100% FREE
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6vw,62px)', fontWeight: 700, fontFamily: 'Georgia, serif', lineHeight: 1.15, margin: '0 0 20px', color: 'var(--text)' }}>
            Research mutual funds<br />
            <span style={{ color: '#e0aa3e' }}>the way professionals do</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--text3)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.65 }}>
            Compare normalized performance, visualize portfolio overlap, get AI-driven fund picks tailored to your risk profile — all in one place, no account needed.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {riskProfile ? (
              <Link to="/dashboard" style={{ background: '#e0aa3e', color: 'var(--on-accent)', padding: '14px 30px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/quiz" style={{ background: '#e0aa3e', color: 'var(--on-accent)', padding: '14px 30px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Get My Fund Picks <ArrowRight size={16} />
              </Link>
            )}
            <Link to="/funds" style={{ background: 'var(--card-inner)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '14px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Browse 987 Funds
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 2 }}>
        <div className="card-rise" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--panel-grad)', border: '1px solid var(--border)', borderRadius: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '24px 16px', textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid #25211a' : 'none' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#e0aa3e', fontFamily: 'Georgia, serif' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 4, letterSpacing: '.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why different */}
      <section style={{ borderTop: '1px solid #1a1610', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: '#e0aa3e', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Why MutualMind</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', margin: 0 }}>What no other free Indian MF tool does</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="card-rise" style={{ background: 'var(--panel-grad)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animationDelay: `${i*70}ms`, transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e0aa3e40'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(224,170,62,.1)', display: 'grid', placeItems: 'center', color: '#e0aa3e', flexShrink: 0 }}>
                    {d.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', margin: 0 }}>{d.title}</h3>
                      <span style={{ fontSize: 10, background: 'rgba(224,170,62,.1)', border: '1px solid rgba(224,170,62,.2)', color: '#e0aa3e', borderRadius: 999, padding: '3px 8px', fontWeight: 700, whiteSpace: 'nowrap' }}>{d.highlight}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '1px solid #1a1610' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 100px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div className="card-rise" style={{ background: 'var(--amber-grad)', border: '1px solid rgba(224,170,62,.2)', borderRadius: 24, padding: '48px 32px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', margin: '0 0 12px' }}>Ready to invest smarter?</h2>
            <p style={{ fontSize: 14, color: 'var(--text4)', margin: '0 0 28px', lineHeight: 1.65 }}>Take our 2-minute risk quiz and get an AI-curated portfolio of direct-plan mutual funds — completely free.</p>
            {riskProfile ? (
              <Link to="/dashboard" style={{ background: '#e0aa3e', color: 'var(--on-accent)', padding: '15px 36px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/quiz" style={{ background: '#e0aa3e', color: 'var(--on-accent)', padding: '15px 36px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Start Risk Quiz <ArrowRight size={16} />
              </Link>
            )}
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16 }}>No account required · Takes under 2 minutes</div>
          </div>
        </div>
      </section>
    </div>
  )
}
