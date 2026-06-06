import { useState, useMemo } from 'react'
import SIPAreaChart from '../components/charts/SIPAreaChart'
import { monthlyRequired, corpusGrowthData, formatINR } from '../utils/sipMath'

const GOAL_PRESETS = [
  { label: 'House Down Payment', amount: 2500000, years: 7 },
  { label: 'Child Education', amount: 5000000, years: 15 },
  { label: 'Retirement', amount: 30000000, years: 25 },
  { label: 'Car', amount: 1000000, years: 3 },
]

export default function SIPCalculator() {
  const [targetAmount, setTargetAmount] = useState(5000000)
  const [years, setYears] = useState(10)
  const [returnPct, setReturnPct] = useState(12)

  const monthly = useMemo(
    () => monthlyRequired(targetAmount, years, returnPct),
    [targetAmount, years, returnPct]
  )

  const chartData = useMemo(
    () => corpusGrowthData(monthly, years, returnPct),
    [monthly, years, returnPct]
  )

  const totalInvested = monthly * years * 12
  const totalReturns = targetAmount - totalInvested
  const wealthRatio = totalInvested > 0 ? (targetAmount / totalInvested).toFixed(2) : 0

  const crossoverYear = chartData.find(d => d.corpus >= 2 * d.invested)?.year

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">SIP Goal Planner</h1>
        <p className="text-slate-500 text-sm">Find the monthly SIP needed to reach any financial goal</p>
      </div>

      {/* Goal presets */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-sm font-medium text-slate-700 mb-3">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {GOAL_PRESETS.map(g => (
            <button
              key={g.label}
              onClick={() => { setTargetAmount(g.amount); setYears(g.years) }}
              className="text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h2 className="font-semibold text-slate-700">Customize</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Amount: <span className="text-indigo-600 font-bold">{formatINR(targetAmount)}</span>
          </label>
          <input
            type="range" min={100000} max={100000000} step={100000}
            value={targetAmount}
            onChange={e => setTargetAmount(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-0.5">
            <span>₹1L</span><span>₹10Cr</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Time Horizon: <span className="text-indigo-600 font-bold">{years} years</span>
            </label>
            <input
              type="range" min={1} max={30} step={1}
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>1 yr</span><span>30 yr</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expected Return: <span className="text-indigo-600 font-bold">{returnPct}% p.a.</span>
            </label>
            <input
              type="range" min={4} max={25} step={0.5}
              value={returnPct}
              onChange={e => setReturnPct(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>4%</span><span>25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm mb-1">Monthly SIP required</p>
        <p className="text-4xl font-extrabold mb-4">{formatINR(monthly)}<span className="text-lg font-medium text-indigo-200"> / month</span></p>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Total Invested', formatINR(totalInvested)],
            ['Wealth Gain', formatINR(Math.max(0, totalReturns))],
            ['Wealth Ratio', `${wealthRatio}×`],
          ].map(([label, value]) => (
            <div key={label} className="bg-indigo-500/40 rounded-xl p-3 text-center">
              <p className="text-indigo-200 text-xs mb-0.5">{label}</p>
              <p className="font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Corpus Growth Over Time</h2>
        <SIPAreaChart data={chartData} crossoverYear={crossoverYear} />
        <div className="flex gap-4 mt-3 text-xs justify-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Total Corpus</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />Amount Invested</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Calculator assumes a fixed monthly SIP with constant annual returns. Actual returns vary.
      </p>
    </div>
  )
}
