import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { RiskBadge } from '../components/ui/Navbar'
import NAVLineChart from '../components/charts/NAVLineChart'
import NewsArticleCard, { SentimentGauge } from '../components/news/NewsArticleCard'
import { ChartSkeleton, CardSkeleton } from '../components/ui/LoadingSkeleton'
import { useNews } from '../hooks/useNews'
import { S } from '../utils/theme'
import api from '../utils/api'

const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y', 'all']
const PERIOD_LABELS = { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1Y', '3y': '3Y', '5y': '5Y', all: 'All' }

export default function FundDetail() {
  const { scheme_code } = useParams()
  const code = parseInt(scheme_code)
  const [fund, setFund]         = useState(null)
  const [navData, setNavData]   = useState(null)
  const [period, setPeriod]     = useState('1y')
  const [loading, setLoading]   = useState(true)
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

  if (loading) return <div style={S.page}><CardSkeleton /></div>
  if (!fund)   return <div style={{ ...S.page, color: 'var(--text4)' }}>Fund not found.</div>

  const r1 = fund.returns_1y
  const returnColor = r1 == null ? 'var(--text4)' : r1 >= 0 ? '#7fb069' : '#e7625f'

  return (
    <div style={{ ...S.page, maxWidth: 860 }}>

      {/* Breadcrumb */}
      <Link to="/compare" style={{ fontSize: 12, color: 'var(--text4)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
        ← Back to Comparator
      </Link>

      {/* Fund header */}
      <div className="card-rise" style={{ ...S.panel, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text4)', margin: '0 0 4px' }}>{fund.fund_house}</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', margin: '0 0 4px', lineHeight: 1.3 }}>
              {fund.scheme_name.split(' - ')[0]}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>{fund.category}</p>
          </div>
          <RiskBadge profile={fund.risk_label} size="lg" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            ['Expense Ratio', fund.expense_ratio != null ? `${fund.expense_ratio}%` : '—', 'var(--text2)'],
            ['AUM', fund.aum_cr ? `₹${(fund.aum_cr / 1000).toFixed(1)}K Cr` : '—', 'var(--text2)'],
            ['Min SIP', fund.min_sip ? `₹${fund.min_sip}` : '—', 'var(--text2)'],
            ['1Y Return', r1 != null ? `${r1 > 0 ? '+' : ''}${r1}%` : '—', returnColor],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: 'var(--text4)', margin: '0 0 4px', letterSpacing: '.3px' }}>{label}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NAV chart */}
      <div style={{ ...S.panel, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={S.panelTitle}>NAV History</p>
          <div style={{ display: 'flex', gap: 4 }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s', background: period === p ? '#e0aa3e' : 'var(--card-inner)', color: period === p ? 'var(--bg)' : 'var(--text3)' }}>
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        {navLoading && <ChartSkeleton height={280} />}
        {!navLoading && navData && <NAVLineChart funds={[{ ...fund, nav_data: navData.nav_data }]} />}
      </div>

      {/* Top holdings */}
      <div style={{ ...S.panel, marginBottom: 20 }}>
        <p style={{ ...S.panelTitle, marginBottom: 14 }}>Top Holdings</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(fund.top_holdings || []).map((stock, i) => (
            <span key={stock} style={{ fontSize: 12, background: 'rgba(224,170,62,.1)', border: '1px solid rgba(224,170,62,.2)', color: '#e0aa3e', borderRadius: 999, padding: '5px 12px', fontWeight: 600 }}>
              #{i + 1} {stock}
            </span>
          ))}
          {!fund.top_holdings?.length && <span style={{ fontSize: 13, color: 'var(--text4)' }}>No holdings data available</span>}
        </div>
      </div>

      {/* News sentiment */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif', marginBottom: 14 }}>News Sentiment</h2>
        {newsLoading && (
          <div>
            <CardSkeleton />
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text4)', marginTop: 10 }}>Fetching news and analyzing sentiment…</p>
          </div>
        )}
        {newsData && (
          <>
            {newsData.articles.length > 0 && <SentimentGauge articles={newsData.articles} />}
            {newsData.articles.length === 0 && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, textAlign: 'center', fontSize: 13, color: 'var(--text4)' }}>
                No recent news found for {fund.top_holdings?.[0]} and {fund.top_holdings?.[1]}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {newsData.articles.map((article, i) => <NewsArticleCard key={i} article={article} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
