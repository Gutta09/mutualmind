import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { RiskBadge } from '../components/ui/Navbar'
import NAVLineChart from '../components/charts/NAVLineChart'
import NewsArticleCard, { SentimentGauge } from '../components/news/NewsArticleCard'
import { ChartSkeleton, CardSkeleton } from '../components/ui/LoadingSkeleton'
import { useNews } from '../hooks/useNews'
import api from '../utils/api'

const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y', 'all']
const PERIOD_LABELS = { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1Y', '3y': '3Y', '5y': '5Y', all: 'All' }

export default function FundDetail() {
  const { scheme_code } = useParams()
  const code = parseInt(scheme_code)
  const [fund, setFund] = useState(null)
  const [navData, setNavData] = useState(null)
  const [period, setPeriod] = useState('1y')
  const [loading, setLoading] = useState(true)
  const [navLoading, setNavLoading] = useState(false)

  const { data: newsData, loading: newsLoading } = useNews(code)

  useEffect(() => {
    api.get(`/api/funds/${code}`).then(r => { setFund(r.data); setLoading(false) })
  }, [code])

  useEffect(() => {
    if (!code) return
    setNavLoading(true)
    api.get(`/api/funds/${code}/nav`, { params: { period } })
      .then(r => { setNavData(r.data); setNavLoading(false) })
      .catch(() => setNavLoading(false))
  }, [code, period])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><CardSkeleton /></div>
  if (!fund) return <div className="max-w-4xl mx-auto px-4 py-8 text-slate-500">Fund not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <Link to="/compare" className="text-xs text-slate-400 hover:text-slate-600">← Back to Comparator</Link>

      {/* Fund header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">{fund.fund_house}</p>
            <h1 className="text-xl font-bold text-slate-800 leading-snug">{fund.scheme_name.split(' - ')[0]}</h1>
            <p className="text-sm text-slate-500 mt-1">{fund.category}</p>
          </div>
          <RiskBadge profile={fund.risk_label} size="lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            ['Expense Ratio', `${fund.expense_ratio}%`],
            ['AUM', `₹${(fund.aum_cr / 1000).toFixed(1)}K Cr`],
            ['Min SIP', `₹${fund.min_sip}`],
            ['1Y Return', `${fund.returns_1y > 0 ? '+' : ''}${fund.returns_1y}%`],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="font-bold text-slate-800 text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NAV chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700">NAV History</h2>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  period === p ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        {navLoading && <ChartSkeleton height={300} />}
        {!navLoading && navData && (
          <NAVLineChart funds={[{ ...fund, nav_data: navData.nav_data }]} />
        )}
      </div>

      {/* Top holdings */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">Top Holdings</h2>
        <div className="flex flex-wrap gap-2">
          {(fund.top_holdings || []).map((stock, i) => (
            <span
              key={stock}
              className="bg-indigo-50 text-indigo-800 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100"
            >
              #{i + 1} {stock}
            </span>
          ))}
        </div>
      </div>

      {/* News sentiment */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">News Sentiment</h2>
        {newsLoading && (
          <div className="space-y-3">
            <CardSkeleton />
            <p className="text-center text-sm text-slate-400 animate-pulse">Fetching news and analyzing sentiment...</p>
          </div>
        )}
        {newsData && (
          <>
            {newsData.articles.length > 0 && <SentimentGauge articles={newsData.articles} />}
            {newsData.articles.length === 0 && (
              <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-400 text-sm">
                No recent news found for {fund.top_holdings?.[0]} and {fund.top_holdings?.[1]}
              </div>
            )}
            <div className="space-y-3">
              {newsData.articles.map((article, i) => (
                <NewsArticleCard key={i} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
