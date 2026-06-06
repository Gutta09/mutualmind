import { useState } from 'react'
import { useFunds } from '../hooks/useFunds'
import FundSelector from '../components/funds/FundSelector'
import VennDiagram from '../components/charts/VennDiagram'
import { getOverlap } from '../utils/overlapUtils'

export default function OverlapVisualizer() {
  const [selectedCodes, setSelectedCodes] = useState([])
  const { funds, loading } = useFunds()

  const selectedFunds = selectedCodes
    .map(code => funds.find(f => f.scheme_code === code))
    .filter(Boolean)

  // Compute all pairwise overlaps for the list below
  const allOverlaps = []
  for (let i = 0; i < selectedFunds.length; i++) {
    for (let j = i + 1; j < selectedFunds.length; j++) {
      const shared = getOverlap(
        selectedFunds[i].top_holdings || [],
        selectedFunds[j].top_holdings || []
      )
      if (shared.length) {
        allOverlaps.push({
          a: selectedFunds[i].scheme_name.split(' - ')[0],
          b: selectedFunds[j].scheme_name.split(' - ')[0],
          stocks: shared,
        })
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Portfolio Overlap Visualizer</h1>
        <p className="text-slate-500 text-sm">See which stocks your funds share — avoid unknowing redundancy</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select 2–3 funds</label>
        {loading ? (
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <FundSelector
            funds={funds}
            selected={selectedCodes}
            onChange={setSelectedCodes}
            maxFunds={3}
            placeholder="Search funds..."
          />
        )}
      </div>

      {selectedFunds.length >= 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <VennDiagram funds={selectedFunds} />
        </div>
      )}

      {allOverlaps.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Overlapping Holdings Detail</h2>
          <div className="space-y-4">
            {allOverlaps.map((pair, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  {pair.a} <span className="text-slate-400 font-normal">∩</span> {pair.b}
                  <span className="ml-2 text-xs text-amber-600 font-medium">{pair.stocks.length} common stocks</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {pair.stocks.map(stock => (
                    <span key={stock} className="bg-amber-50 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200">
                      {stock}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCodes.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🔵</div>
          <p className="font-medium">Select 2–3 funds to visualize overlap</p>
          <p className="text-sm mt-1">Large cap and index funds typically have 60–80% overlap</p>
        </div>
      )}
    </div>
  )
}
