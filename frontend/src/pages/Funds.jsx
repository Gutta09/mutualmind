import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFunds } from '../hooks/useFunds'

const CATEGORY_GUIDE = [
  { key: 'Large Cap',  emoji: '🏢', risk: 'Lower Risk',   desc: "India's top 100 biggest companies. Stable, reliable growth.", color: '#3b82f6' },
  { key: 'Index',      emoji: '📊', risk: 'Low Risk',     desc: 'Tracks Nifty 50 or Sensex. Simple, low cost, great for beginners.', color: '#06b6d4' },
  { key: 'Flexi Cap',  emoji: '🔄', risk: 'Medium Risk',  desc: 'Manager picks across all company sizes. Flexible and diversified.', color: '#8b5cf6' },
  { key: 'Mid Cap',    emoji: '📈', risk: 'Medium-High',  desc: 'Ranks 101–250. Higher growth potential than large cap.', color: '#a78bfa' },
  { key: 'ELSS',       emoji: '💰', risk: 'Medium-High',  desc: 'Saves up to ₹46,800/year in tax. 3-year lock-in.', color: '#14b8a6' },
  { key: 'Small Cap',  emoji: '🌱', risk: 'High Risk',    desc: 'Ranks 251+. Highest growth potential, most volatile.', color: '#ef4444' },
]

const CAT_COLOR = {
  'Large Cap': '#3b82f6', 'Mid Cap': '#8b5cf6', 'Small Cap': '#ef4444',
  'Flexi Cap': '#6366f1', 'Multi Cap': '#a855f7', 'Index': '#06b6d4',
  'ELSS': '#14b8a6', 'Thematic': '#f97316', 'Focused': '#ec4899',
  'Balanced Advantage': '#e0aa3e', 'Aggressive Hybrid': '#f59e0b',
}
const RISK_COLOR = { Conservative: '#7fb069', Moderate: '#e0aa3e', Aggressive: '#e7625f' }

const PER_PAGE = 24

export default function Funds() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [risk, setRisk]         = useState('All')
  const [page, setPage]         = useState(1)
  const [sort, setSort]         = useState('name')

  const { funds, loading, error } = useFunds()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let list = funds.filter(f => {
      const matchSearch = !q || f.scheme_name.toLowerCase().includes(q) || (f.fund_house || '').toLowerCase().includes(q)
      const matchCat    = category === 'All' || f.category === category
      const matchRisk   = risk === 'All' || f.risk_label === risk
      return matchSearch && matchCat && matchRisk
    })
    if (sort === 'return1y') list = [...list].sort((a, b) => (b.returns_1y ?? -999) - (a.returns_1y ?? -999))
    if (sort === 'return3y') list = [...list].sort((a, b) => (b.returns_3y ?? -999) - (a.returns_3y ?? -999))
    if (sort === 'er')       list = [...list].sort((a, b) => (a.expense_ratio ?? 999) - (b.expense_ratio ?? 999))
    return list
  }, [funds, search, category, risk, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function applyFilter(fn) { fn(); setPage(1) }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px', position: 'relative', zIndex: 2 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>Browse Funds</h1>
        <p style={{ fontSize: 13, color: '#5a544a', margin: 0 }}>
          {loading ? 'Loading…' : `${filtered.length.toLocaleString()} funds`}
          {!loading && filtered.length !== funds.length ? ` of ${funds.length.toLocaleString()} total` : ''}
          {' '} — all Direct Plan, Growth option
        </p>
      </div>

      {/* Category guide */}
      {category === 'All' && !search && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#5a544a', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>New to mutual funds? Start here</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
            {CATEGORY_GUIDE.map(c => (
              <button key={c.key} onClick={() => applyFilter(() => setCategory(c.key))}
                style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: `1px solid ${c.color}30`, borderRadius: 16, padding: '14px 12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = c.color + '70'}
                onMouseLeave={e => e.currentTarget.style.borderColor = c.color + '30'}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8e2d4', marginBottom: 3 }}>{c.key}</div>
                <span style={{ fontSize: 10, background: c.color + '18', color: c.color, borderRadius: 999, padding: '2px 7px', fontWeight: 700 }}>{c.risk}</span>
                <p style={{ fontSize: 11, color: '#5a544a', lineHeight: 1.5, margin: '6px 0 0' }}>{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder='Search by fund name or AMC (e.g. "Mirae" or "Nifty 50")…'
          value={search}
          onChange={e => applyFilter(() => setSearch(e.target.value))}
          style={{ background: '#1a1610', border: '1px solid #2a2620', borderRadius: 10, padding: '10px 14px', color: '#e8e2d4', fontSize: 14, outline: 'none', width: '100%', marginBottom: 12 }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {/* Active category chip */}
          {category !== 'All' && (
            <button onClick={() => applyFilter(() => setCategory('All'))}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e0aa3e', color: '#0d0b07', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
              {category} ✕
            </button>
          )}

          {/* Risk filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Conservative', 'Moderate', 'Aggressive'].map(r => (
              <button key={r} onClick={() => applyFilter(() => setRisk(r))}
                style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: risk === r ? '#e8e2d4' : '#1c1810', color: risk === r ? '#0d0b07' : '#8a8174', transition: 'all .15s' }}>
                {r === 'All' ? 'All Risk' : r}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#5a544a' }}>Sort:</span>
            {[['name','A–Z'],['return1y','1Y Return'],['return3y','3Y Return'],['er','Low Cost']].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)}
                style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: sort === v ? '#e0aa3e' : '#1c1810', color: sort === v ? '#0d0b07' : '#8a8174', transition: 'all .15s' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        {(search || category === 'All') && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e1b15' }}>
            {['All','Large Cap','Mid Cap','Small Cap','Flexi Cap','Multi Cap','Index','ELSS','Thematic','Focused','Balanced Advantage','Aggressive Hybrid'].map(c => (
              <button key={c} onClick={() => applyFilter(() => setCategory(c))}
                style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: '1px solid', cursor: 'pointer', transition: 'all .15s', background: category === c ? 'rgba(224,170,62,.15)' : 'transparent', color: category === c ? '#e0aa3e' : '#5a544a', borderColor: category === c ? 'rgba(224,170,62,.3)' : '#25211a' }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ height: 120, background: 'linear-gradient(160deg,#16130d,#100d08)', borderRadius: 16, border: '1px solid #1e1b15', opacity: 0.5 }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#1a0f0f', border: '1px solid #5a2020', borderRadius: 16, padding: 20, fontSize: 13, color: '#e7625f' }}>
          Failed to load funds. Please refresh the page.
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif' }}>No funds found</p>
          <p style={{ fontSize: 13, color: '#5a544a', marginTop: 4, marginBottom: 20 }}>Try a different search or clear your filters</p>
          <button onClick={() => { setSearch(''); setCategory('All'); setRisk('All') }}
            style={{ background: '#e0aa3e', color: '#0d0b07', border: 'none', borderRadius: 11, padding: '11px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Clear all filters
          </button>
        </div>
      )}

      {/* Fund grid */}
      {!loading && paginated.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {paginated.map((fund, idx) => {
              const cc = CAT_COLOR[fund.category] || '#8a8174'
              const rc = RISK_COLOR[fund.risk_label] || '#8a8174'
              const name = fund.scheme_name.split(' - ')[0]
              return (
                <Link key={fund.scheme_code} to={`/fund/${fund.scheme_code}`} className="card-rise"
                  style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 16, padding: 16, textDecoration: 'none', display: 'block', transition: 'border-color .2s', animationDelay: `${(idx % 24) * 30}ms` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e0aa3e40'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#25211a'}>

                  <p style={{ fontSize: 10, color: '#5a544a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fund.fund_house}</p>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#e8e2d4', lineHeight: 1.4, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {name}
                  </h3>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, background: cc + '18', color: cc, borderRadius: 6, padding: '3px 8px', fontWeight: 700 }}>{fund.category}</span>
                    <span style={{ fontSize: 10, background: rc + '14', color: rc, border: `1px solid ${rc}30`, borderRadius: 6, padding: '3px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: rc, display: 'inline-block' }} />
                      {fund.risk_label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, background: '#0d0b07', borderRadius: 10, padding: 10 }}>
                    {[['1Y', fund.returns_1y], ['3Y', fund.returns_3y], ['ER', fund.expense_ratio != null ? fund.expense_ratio + '%' : null]].map(([label, val]) => {
                      const isReturn = label !== 'ER'
                      const color = val == null ? '#3a352c' : isReturn ? (parseFloat(val) >= 0 ? '#7fb069' : '#e7625f') : '#c9c2b4'
                      return (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color }}>{val != null ? (isReturn ? `${parseFloat(val) > 0 ? '+' : ''}${val}%` : val) : '—'}</div>
                          <div style={{ fontSize: 10, color: '#5a544a', marginTop: 1 }}>{label}</div>
                        </div>
                      )
                    })}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 24 }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 10, border: '1px solid #25211a', background: page === 1 ? 'transparent' : '#16130d', color: page === 1 ? '#3a352c' : '#c9c2b4', cursor: page === 1 ? 'default' : 'pointer', fontWeight: 600 }}>
                ← Previous
              </button>
              <span style={{ fontSize: 12, color: '#5a544a', fontWeight: 500 }}>
                Page {page} of {totalPages} <span style={{ color: '#3a352c' }}>({filtered.length} funds)</span>
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 10, border: '1px solid #25211a', background: page === totalPages ? 'transparent' : '#16130d', color: page === totalPages ? '#3a352c' : '#c9c2b4', cursor: page === totalPages ? 'default' : 'pointer', fontWeight: 600 }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
