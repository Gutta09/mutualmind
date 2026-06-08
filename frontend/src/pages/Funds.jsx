import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFunds } from '../hooks/useFunds'

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap',
  'Large & Mid Cap', 'ELSS', 'Index', 'Thematic', 'Focused', 'Value',
  'Dividend Yield', 'Aggressive Hybrid', 'Balanced Advantage', 'Multi Asset']
const RISKS = ['All', 'Conservative', 'Moderate', 'Aggressive']

const RISK_STYLES = {
  Conservative: { dot: 'bg-emerald-500', badge: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  Moderate:     { dot: 'bg-amber-500',   badge: 'bg-amber-950 text-amber-400 border-amber-800' },
  Aggressive:   { dot: 'bg-red-500',     badge: 'bg-red-950 text-red-400 border-red-800' },
}

const CAT_COLOR = {
  'Large Cap': 'bg-blue-950 text-blue-400',
  'Mid Cap': 'bg-violet-950 text-violet-400',
  'Small Cap': 'bg-rose-950 text-rose-400',
  'Flexi Cap': 'bg-indigo-950 text-indigo-400',
  'Multi Cap': 'bg-purple-950 text-purple-400',
  'Index': 'bg-cyan-950 text-cyan-400',
  'ELSS': 'bg-teal-950 text-teal-400',
  'Thematic': 'bg-orange-950 text-orange-400',
}

function ReturnPill({ value, label }) {
  if (value == null) return <span className="text-slate-600 text-xs">{label}: —</span>
  const pos = value >= 0
  return (
    <span className={`text-xs font-semibold ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
      {label}: {pos ? '+' : ''}{value}%
    </span>
  )
}

export default function Funds() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [risk, setRisk] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 30

  const { funds, loading, error } = useFunds()

  const filtered = funds.filter(f => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      f.scheme_name.toLowerCase().includes(q) ||
      (f.fund_house || '').toLowerCase().includes(q)
    const matchCategory = category === 'All' || f.category === category
    const matchRisk = risk === 'All' || f.risk_label === risk
    return matchSearch && matchCategory && matchRisk
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleFilter(fn) {
    fn()
    setPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Browse Funds</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Loading...' : `${filtered.length} funds`}
            {!loading && funds.length > 0 && filtered.length !== funds.length && ` of ${funds.length} total`}
          </p>
        </div>
        <Link to="/compare" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          Compare funds →
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <input
          type="text"
          placeholder="Search by fund name or AMC…"
          value={search}
          onChange={e => handleFilter(() => setSearch(e.target.value))}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
        />
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-xs text-slate-400 font-medium">Risk:</span>
            {RISKS.map(r => (
              <button key={r} onClick={() => handleFilter(() => setRisk(r))}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  risk === r ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => handleFilter(() => setCategory(c))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                category === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Fund grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
          Failed to load funds: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-slate-600">No funds match your filters</p>
          <button onClick={() => { setSearch(''); setCategory('All'); setRisk('All') }}
            className="mt-3 text-sm text-indigo-600 hover:underline">
            Clear all filters
          </button>
        </div>
      )}

      {!loading && paginated.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paginated.map(fund => {
              const rs = RISK_STYLES[fund.risk_label] || RISK_STYLES.Moderate
              const catColor = CAT_COLOR[fund.category] || 'bg-slate-100 text-slate-600'
              return (
                <Link key={fund.scheme_code} to={`/fund/${fund.scheme_code}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all group block">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400 mb-0.5 truncate">{fund.fund_house}</p>
                      <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                        {fund.scheme_name.split(' - ')[0]}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${rs.badge}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${rs.dot} mr-1`} />
                        {fund.risk_label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${catColor}`}>
                      {fund.category}
                    </span>
                    <div className="flex gap-3 ml-auto">
                      <ReturnPill value={fund.returns_1y} label="1Y" />
                      <ReturnPill value={fund.returns_3y} label="3Y" />
                      {fund.expense_ratio && (
                        <span className="text-xs text-slate-400">ER: {fund.expense_ratio}%</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                ← Prev
              </button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
