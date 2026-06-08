import { useState } from 'react'
import { useFunds } from '../hooks/useFunds'
import { useNAV } from '../hooks/useNAV'
import FundSelector from '../components/funds/FundSelector'
import NAVLineChart from '../components/charts/NAVLineChart'
import ReturnsTable from '../components/funds/ReturnsTable'
import { ChartSkeleton } from '../components/ui/LoadingSkeleton'
import { S, COLORS } from '../utils/theme'

const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y', 'all']
const PERIOD_LABELS = { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1Y', '3y': '3Y', '5y': '5Y', all: 'All' }

export default function Comparator() {
  const [selectedCodes, setSelectedCodes] = useState([])
  const [period, setPeriod] = useState('1y')

  const { funds, loading: fundsLoading } = useFunds()
  const { data: navFunds, loading: navLoading, error: navError } = useNAV(selectedCodes, period)

  const selectedFundMeta = selectedCodes.map(code => funds.find(f => f.scheme_code === code)).filter(Boolean)

  return (
    <div style={{ ...S.page, maxWidth: 1000 }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={S.h1}>Fund Comparator</h1>
        <p style={{ fontSize: 13, color: '#5a544a', margin: 0 }}>Compare up to 5 funds with indexed performance charts — normalized returns, not raw NAV</p>
      </div>

      {/* Fund selector */}
      <div style={{ ...S.panel, marginBottom: 20 }}>
        <div style={S.panelHead}>
          <div>
            <p style={S.panelTitle}>Select Funds</p>
            <p style={S.panelSub}>Search and pick up to 5 funds to compare</p>
          </div>
          <span style={S.badge}>max 5</span>
        </div>

        {fundsLoading ? (
          <div style={{ height: 44, background: '#1a1610', borderRadius: 10, opacity: 0.5 }} />
        ) : (
          <FundSelector funds={funds} selected={selectedCodes} onChange={setSelectedCodes} maxFunds={5} />
        )}

        {selectedCodes.length > 0 && (
          <p style={{ fontSize: 11, color: '#5a544a', marginTop: 10 }}>
            📐 Charts are indexed to 100 at the start of the period — showing relative performance, not raw NAV
          </p>
        )}
      </div>

      {/* Chart area */}
      {selectedCodes.length > 0 && (
        <div style={{ ...S.panel, marginBottom: 20 }}>
          <div style={S.panelHead}>
            <p style={S.panelTitle}>Performance (Indexed to 100)</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {PERIODS.map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s', background: period === p ? '#e0aa3e' : '#1c1810', color: period === p ? '#0d0b07' : '#8a8174' }}>
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {navLoading && <ChartSkeleton height={300} />}
          {navError && (
            <div style={{ background: '#1a0f0f', border: '1px solid #5a2020', borderRadius: 10, padding: 14, fontSize: 13, color: '#e7625f' }}>{navError}</div>
          )}
          {!navLoading && !navError && navFunds.length > 0 && <NAVLineChart funds={navFunds} />}
        </div>
      )}

      {/* Returns table */}
      {navFunds.length > 0 && !navLoading && (
        <div style={{ ...S.panel, marginBottom: 20 }}>
          <p style={{ ...S.panelTitle, marginBottom: 14 }}>Returns Comparison</p>
          <ReturnsTable funds={navFunds} />
        </div>
      )}

      {/* Fund metadata cards */}
      {selectedFundMeta.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {selectedFundMeta.map((fund, i) => {
            const c = COLORS[i % COLORS.length]
            return (
              <div key={fund.scheme_code} style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: `1px solid ${c}25`, borderRadius: 14, padding: 16 }}>
                <div style={{ width: 3, height: 28, background: c, borderRadius: 2, marginBottom: 8 }} />
                <p style={{ fontSize: 10, color: '#5a544a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fund.fund_house}</p>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#e8e2d4', margin: '0 0 12px', lineHeight: 1.4 }}>
                  {fund.scheme_name.split(' - ')[0]}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  {[['Category', fund.category], ['Expense Ratio', fund.expense_ratio ? fund.expense_ratio + '%' : '—'], ['AUM', fund.aum_cr ? '₹' + (fund.aum_cr / 1000).toFixed(1) + 'K Cr' : '—'], ['Min SIP', fund.min_sip ? '₹' + fund.min_sip : '—']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#5a544a' }}>{label}</span>
                      <span style={{ color: '#c9c2b4', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {selectedCodes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif' }}>Search for funds above to start comparing</p>
          <p style={{ fontSize: 13, color: '#5a544a', marginTop: 6 }}>You can compare up to 5 funds at once</p>
        </div>
      )}
    </div>
  )
}
