import { useState, useMemo } from 'react'
import SIPAreaChart from '../components/charts/SIPAreaChart'
import { monthlyRequired, corpusGrowthData, formatINR } from '../utils/sipMath'
import { S } from '../utils/theme'

const GOAL_PRESETS = [
  { label: 'House Down Payment', amount: 2500000, years: 7 },
  { label: 'Child Education',    amount: 5000000, years: 15 },
  { label: 'Retirement',         amount: 30000000, years: 25 },
  { label: 'Car',                amount: 1000000,  years: 3 },
]

function Slider({ label, min, max, step, value, onChange, leftLabel, rightLabel, format }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 13, color: '#8a8174' }}>{label}</label>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#e0aa3e', fontFamily: 'Georgia, serif' }}>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: '100%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#3a352c', marginTop: 4 }}>
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  )
}

export default function SIPCalculator() {
  const [targetAmount, setTargetAmount] = useState(5000000)
  const [years, setYears]               = useState(10)
  const [returnPct, setReturnPct]       = useState(12)

  const monthly = useMemo(() => monthlyRequired(targetAmount, years, returnPct), [targetAmount, years, returnPct])
  const chartData = useMemo(() => corpusGrowthData(monthly, years, returnPct), [monthly, years, returnPct])
  const totalInvested = monthly * years * 12
  const totalReturns = targetAmount - totalInvested
  const wealthRatio = totalInvested > 0 ? (targetAmount / totalInvested).toFixed(2) : 0
  const crossoverYear = chartData.find(d => d.corpus >= 2 * d.invested)?.year

  return (
    <div style={{ ...S.page, maxWidth: 800 }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={S.h1}>SIP Goal Planner</h1>
        <p style={{ fontSize: 13, color: '#5a544a', margin: 0 }}>Find the monthly SIP needed to reach any financial goal</p>
      </div>

      {/* Goal presets */}
      <div style={{ ...S.panel, marginBottom: 20 }}>
        <p style={{ ...S.panelTitle, marginBottom: 14 }}>Quick Presets</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GOAL_PRESETS.map(g => (
            <button key={g.label} onClick={() => { setTargetAmount(g.amount); setYears(g.years) }}
              style={{ fontSize: 12, background: '#1c1810', border: '1px solid #2a2620', color: '#c9c2b4', padding: '8px 14px', borderRadius: 9, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e0aa3e'; e.currentTarget.style.color = '#e0aa3e' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2620'; e.currentTarget.style.color = '#c9c2b4' }}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div style={{ ...S.panel, marginBottom: 20 }}>
        <p style={{ ...S.panelTitle, marginBottom: 20 }}>Customize Your Goal</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Slider label="Target Amount" min={100000} max={100000000} step={100000}
            value={targetAmount} onChange={setTargetAmount}
            leftLabel="₹1L" rightLabel="₹10Cr" format={formatINR} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Slider label="Time Horizon" min={1} max={30} step={1}
              value={years} onChange={setYears}
              leftLabel="1 yr" rightLabel="30 yr" format={v => `${v} years`} />
            <Slider label="Expected Return" min={4} max={25} step={0.5}
              value={returnPct} onChange={setReturnPct}
              leftLabel="4%" rightLabel="25%" format={v => `${v}% p.a.`} />
          </div>
        </div>
      </div>

      {/* Result hero */}
      <div className="card-rise" style={{ background: 'linear-gradient(135deg,#1a1508,#2a1f08)', border: '1px solid rgba(224,170,62,.3)', borderRadius: 20, padding: '28px 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: '#8a8174', marginBottom: 6, letterSpacing: '.5px' }}>MONTHLY SIP REQUIRED</p>
        <p style={{ fontSize: 42, fontWeight: 800, color: '#e0aa3e', fontFamily: 'Georgia, serif', margin: '0 0 20px', lineHeight: 1 }}>
          {formatINR(monthly)}
          <span style={{ fontSize: 16, fontWeight: 400, color: '#8a8174', marginLeft: 8 }}>/ month</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[['Total Invested', formatINR(totalInvested)], ['Wealth Gain', formatINR(Math.max(0, totalReturns))], ['Wealth Ratio', `${wealthRatio}×`]].map(([label, value]) => (
            <div key={label} style={{ background: 'rgba(224,170,62,.08)', border: '1px solid rgba(224,170,62,.1)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#8a8174', margin: '0 0 4px', letterSpacing: '.3px' }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e8e2d4', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth chart */}
      <div style={{ ...S.panel, marginBottom: 16 }}>
        <p style={{ ...S.panelTitle, marginBottom: 16 }}>Corpus Growth Over Time</p>
        <SIPAreaChart data={chartData} crossoverYear={crossoverYear} />
        <div style={{ display: 'flex', gap: 16, marginTop: 14, justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a8174' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7fb069', display: 'inline-block' }} />Total Corpus
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a8174' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#5a544a', display: 'inline-block' }} />Amount Invested
          </span>
        </div>
      </div>

      {crossoverYear && (
        <div style={{ background: 'rgba(127,176,105,.08)', border: '1px solid rgba(127,176,105,.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#7fb069', marginBottom: 12 }}>
          Your returns outpace your principal around <strong>year {crossoverYear}</strong> — the compounding inflection point
        </div>
      )}

      <p style={{ fontSize: 11, color: '#3a352c', textAlign: 'center' }}>
        Assumes fixed monthly SIP with constant annual returns. Actual returns vary.
      </p>
    </div>
  )
}
