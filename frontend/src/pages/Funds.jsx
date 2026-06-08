import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFunds } from '../hooks/useFunds'

const CATEGORY_GUIDE = [
  { key: 'Large Cap',  emoji: '🏢', color: 'bg-blue-50 border-blue-200 text-blue-900',   tag: 'bg-blue-100 text-blue-800',   risk: 'Lower Risk',  desc: "India's top 100 biggest companies. Stable, reliable growth." },
  { key: 'Index',      emoji: '📊', color: 'bg-cyan-50 border-cyan-200 text-cyan-900',    tag: 'bg-cyan-100 text-cyan-800',    risk: 'Low Risk',    desc: 'Tracks Nifty 50 or Sensex. Simple, low cost, great for beginners.' },
  { key: 'Flexi Cap',  emoji: '🔄', color: 'bg-indigo-50 border-indigo-200 text-indigo-900', tag: 'bg-indigo-100 text-indigo-800', risk: 'Medium Risk', desc: 'Manager picks across all company sizes. Flexible and diversified.' },
  { key: 'Mid Cap',    emoji: '📈', color: 'bg-violet-50 border-violet-200 text-violet-900', tag: 'bg-violet-100 text-violet-800', risk: 'Medium-High', desc: 'Ranks 101–250. Higher growth potential than large cap.' },
  { key: 'ELSS',       emoji: '💰', color: 'bg-teal-50 border-teal-200 text-teal-900',    tag: 'bg-teal-100 text-teal-800',    risk: 'Medium-High', desc: 'Saves up to ₹46,800/year in tax. 3-year lock-in.' },
  { key: 'Small Cap',  emoji: '🌱', color: 'bg-rose-50 border-rose-200 text-rose-900',    tag: 'bg-rose-100 text-rose-800',    risk: 'High Risk',   desc: 'Ranks 251+. Highest growth potential, most volatile.' },
]

const RISK_DOT = {
  Conservative: 'bg-emerald-500',
  Moderate:     'bg-amber-500',
  Aggressive:   'bg-red-500',
}
const RISK_BADGE = {
  Conservative: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Moderate:     'bg-amber-50 text-amber-700 border border-amber-200',
  Aggressive:   'bg-red-50 text-red-700 border border-red-200',
}
const CAT_TAG = {
  'Large Cap': 'bg-blue-100 text-blue-700',
  'Mid Cap': 'bg-violet-100 text-violet-700',
  'Small Cap': 'bg-rose-100 text-rose-700',
  'Flexi Cap': 'bg-indigo-100 text-indigo-700',
  'Multi Cap': 'bg-purple-100 text-purple-700',
  'Index': 'bg-cyan-100 text-cyan-700',
  'ELSS': 'bg-teal-100 text-teal-700',
  'Thematic': 'bg-orange-100 text-orange-700',
  'Focused': 'bg-fuchsia-100 text-fuchsia-700',
  'Balanced Advantage': 'bg-amber-100 text-amber-700',
}

const PER_PAGE = 24

export default function Funds() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [risk, setRisk]           = useState('All')
  const [page, setPage]           = useState(1)
  const [sort, setSort]           = useState('name')

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Browse Funds</h1>
        <p className="text-slate-500 mt-1">
          {loading ? 'Loading…' : `${filtered.length.toLocaleString()} funds`}
          {!loading && filtered.length !== funds.length ? ` of ${funds.length.toLocaleString()} total` : ''}
          {' '} — all Direct Plan, Growth option
        </p>
      </div>

      {/* Category guide cards — beginner oriented */}
      {category === 'All' && !search && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">New to mutual funds? Start here</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_GUIDE.map(c => (
              <button key={c.key} onClick={() => applyFilter(() => setCategory(c.key))}
                className={`border-2 rounded-2xl p-3 text-left hover:shadow-md transition-all group ${c.color}`}>
                <div className="text-2xl mb-1.5">{c.emoji}</div>
                <div className="font-bold text-sm mb-0.5">{c.key}</div>
                <div className={`text-xs font-semibold px-1.5 py-0.5 rounded-md inline-block mb-1.5 ${c.tag}`}>{c.risk}</div>
                <p className="text-xs opacity-70 leading-snug">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search + filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <input
          type="text"
          placeholder="Search by fund name or AMC (e.g. &quot;Mirae&quot; or &quot;Nifty 50&quot;)…"
          value={search}
          onChange={e => applyFilter(() => setSearch(e.target.value))}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50 placeholder:text-slate-400"
        />

        <div className="flex flex-wrap gap-2 items-center">
          {/* Active category chip */}
          {category !== 'All' && (
            <button onClick={() => applyFilter(() => setCategory('All'))}
              className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {category} ✕
            </button>
          )}

          {/* Risk filter */}
          <div className="flex gap-1">
            {['All','Conservative','Moderate','Aggressive'].map(r => (
              <button key={r} onClick={() => applyFilter(() => setRisk(r))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  risk === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {r === 'All' ? 'All Risk' : r}
              </button>
            ))}
          </div>

          <div className="flex gap-1 ml-auto">
            <span className="text-xs text-slate-400 self-center mr-1">Sort:</span>
            {[['name','A–Z'],['return1y','1Y Return'],['return3y','3Y Return'],['er','Low Cost']].map(([v,l]) => (
              <button key={v} onClick={() => setSort(v)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  sort === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips when searching */}
        {(search || category === 'All') && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
            {['All','Large Cap','Mid Cap','Small Cap','Flexi Cap','Multi Cap','Index','ELSS','Thematic','Focused','Balanced Advantage','Aggressive Hybrid'].map(c => (
              <button key={c} onClick={() => applyFilter(() => setCategory(c))}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  category === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fund grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_,i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
          Failed to load funds. Please refresh the page.
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-xl font-bold text-slate-700">No funds found</p>
          <p className="text-slate-400 mt-1 mb-4">Try a different search or clear your filters</p>
          <button onClick={() => { setSearch(''); setCategory('All'); setRisk('All') }}
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            Clear all filters
          </button>
        </div>
      )}

      {!loading && paginated.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(fund => {
              const catTag = CAT_TAG[fund.category] || 'bg-slate-100 text-slate-600'
              const riskBadge = RISK_BADGE[fund.risk_label] || 'bg-slate-100 text-slate-600 border border-slate-200'
              const riskDot = RISK_DOT[fund.risk_label] || 'bg-slate-400'
              return (
                <Link key={fund.scheme_code} to={`/fund/${fund.scheme_code}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all group block">

                  {/* Fund house + name */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 truncate mb-0.5">{fund.fund_house}</p>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                      {fund.scheme_name.split(' - ')[0]}
                    </h3>
                  </div>

                  {/* Tags row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catTag}`}>
                      {fund.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${riskDot}`} />
                      {fund.risk_label}
                    </span>
                  </div>

                  {/* Returns row */}
                  <div className="grid grid-cols-3 gap-1 text-center bg-slate-50 rounded-xl p-2">
                    <div>
                      <div className={`text-xs font-bold ${fund.returns_1y != null ? (fund.returns_1y >= 0 ? 'text-emerald-600' : 'text-red-600') : 'text-slate-400'}`}>
                        {fund.returns_1y != null ? `${fund.returns_1y > 0 ? '+' : ''}${fund.returns_1y}%` : '—'}
                      </div>
                      <div className="text-xs text-slate-400">1Y</div>
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${fund.returns_3y != null ? (fund.returns_3y >= 0 ? 'text-emerald-600' : 'text-red-600') : 'text-slate-400'}`}>
                        {fund.returns_3y != null ? `${fund.returns_3y > 0 ? '+' : ''}${fund.returns_3y}%` : '—'}
                      </div>
                      <div className="text-xs text-slate-400">3Y</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-600">
                        {fund.expense_ratio != null ? `${fund.expense_ratio}%` : '—'}
                      </div>
                      <div className="text-xs text-slate-400">ER</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-4 py-2 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors font-medium">
                ← Previous
              </button>
              <span className="text-sm text-slate-500 font-medium">
                Page {page} of {totalPages}
                <span className="text-slate-400"> ({filtered.length} funds)</span>
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-4 py-2 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors font-medium">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
