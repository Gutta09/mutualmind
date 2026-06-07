import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFunds } from '../hooks/useFunds'

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'ELSS', 'Index']
const RISKS = ['All', 'Conservative', 'Moderate', 'Aggressive']

const RISK_COLORS = {
  Conservative: 'bg-emerald-100 text-emerald-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Aggressive: 'bg-red-100 text-red-700',
}

export default function Funds() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [risk, setRisk] = useState('All')

  const { funds, loading, error } = useFunds()

  const filtered = funds.filter(f => {
    const matchSearch = !search || f.scheme_name.toLowerCase().includes(search.toLowerCase()) || f.fund_house.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || f.category === category
    const matchRisk = risk === 'All' || f.risk_label === risk
    return matchSearch && matchCategory && matchRisk
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Browse Funds</h1>
        <p className="text-slate-500 text-sm">{funds.length} funds available — click any fund for details</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by fund name or house..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={risk}
          onChange={e => setRisk(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {RISKS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Fund list */}
      {loading && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          Failed to load funds: {error}
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>No funds match your filters</p>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(fund => (
            <Link
              key={fund.scheme_code}
              to={`/fund/${fund.scheme_code}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-xs text-slate-400 mb-0.5">{fund.fund_house}</p>
                  <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
                    {fund.scheme_name.split(' - ')[0]}
                  </h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${RISK_COLORS[fund.risk_label] || 'bg-slate-100 text-slate-600'}`}>
                  {fund.risk_label}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-slate-500 mt-3">
                <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-600">{fund.category}</span>
                <span>1Y: <span className={`font-semibold ${fund.returns_1y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fund.returns_1y > 0 ? '+' : ''}{fund.returns_1y}%</span></span>
                <span>3Y: <span className={`font-semibold ${fund.returns_3y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fund.returns_3y > 0 ? '+' : ''}{fund.returns_3y}%</span></span>
                <span>ER: <span className="font-medium text-slate-700">{fund.expense_ratio}%</span></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
