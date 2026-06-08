import { useState } from 'react'
import { useFunds } from '../hooks/useFunds'
import { useNAV } from '../hooks/useNAV'
import FundSelector from '../components/funds/FundSelector'
import NAVLineChart from '../components/charts/NAVLineChart'
import ReturnsTable from '../components/funds/ReturnsTable'
import { ChartSkeleton } from '../components/ui/LoadingSkeleton'

const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y', 'all']
const PERIOD_LABELS = { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1Y', '3y': '3Y', '5y': '5Y', all: 'All' }

export default function Comparator() {
  const [selectedCodes, setSelectedCodes] = useState([])
  const [period, setPeriod] = useState('1y')

  const { funds, loading: fundsLoading } = useFunds()
  const { data: navFunds, loading: navLoading, error: navError } = useNAV(selectedCodes, period)

  const selectedFundMeta = selectedCodes.map(code => funds.find(f => f.scheme_code === code)).filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Fund Comparator</h1>
        <p className="text-slate-500 text-sm">Compare up to 5 funds with indexed performance charts</p>
      </div>

      {/* Fund selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select funds to compare (max 5)
        </label>
        {fundsLoading ? (
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <FundSelector
            funds={funds}
            selected={selectedCodes}
            onChange={setSelectedCodes}
            maxFunds={5}
          />
        )}
        {selectedCodes.length > 0 && (
          <p className="text-xs text-slate-400 mt-2">
            Charts are indexed to 100 at the start of the period — showing relative performance, not raw NAV.
          </p>
        )}
      </div>

      {/* Chart area */}
      {selectedCodes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {/* Period selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">Performance (Indexed to 100)</h2>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    period === p
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {navLoading && <ChartSkeleton height={320} />}
          {navError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{navError}</div>
          )}
          {!navLoading && !navError && navFunds.length > 0 && (
            <NAVLineChart funds={navFunds} />
          )}
        </div>
      )}

      {/* Returns table */}
      {navFunds.length > 0 && !navLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Returns Comparison</h2>
          <ReturnsTable funds={navFunds} />
        </div>
      )}

      {/* Fund metadata cards */}
      {selectedFundMeta.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedFundMeta.map(fund => (
            <div key={fund.scheme_code} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">{fund.fund_house}</p>
              <h3 className="font-semibold text-slate-800 text-sm mb-2 leading-snug">
                {fund.scheme_name.split(' - ')[0]}
              </h3>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span>Category</span><span className="font-medium">{fund.category}</span></div>
                <div className="flex justify-between"><span>Expense Ratio</span><span className="font-medium">{fund.expense_ratio}%</span></div>
                <div className="flex justify-between"><span>AUM</span><span className="font-medium">₹{(fund.aum_cr / 1000).toFixed(1)}K Cr</span></div>
                <div className="flex justify-between"><span>Min SIP</span><span className="font-medium">₹{fund.min_sip}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCodes.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-medium">Search for funds above to start comparing</p>
          <p className="text-sm mt-1">You can compare up to 5 funds at once</p>
        </div>
      )}
    </div>
  )
}
