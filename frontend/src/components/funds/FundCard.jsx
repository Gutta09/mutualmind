import { Link } from 'react-router-dom'
import { RiskBadge } from '../ui/Navbar'

const RISK_COLOR = { Conservative: '#7fb069', Moderate: '#e0aa3e', Aggressive: '#e7625f' }

export default function FundCard({ fund }) {
  const rc = RISK_COLOR[fund.risk_label] || '#8a8174'
  return (
    <div style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 16, padding: 16, transition: 'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#e0aa3e40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#25211a'}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 10, color: '#5a544a', margin: '0 0 3px' }}>{fund.fund_house}</p>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#e8e2d4', lineHeight: 1.4, margin: 0 }}>
            {fund.scheme_name.split(' - ')[0]}
          </h3>
        </div>
        <RiskBadge profile={fund.risk_label} />
      </div>
      <p style={{ fontSize: 11, color: '#5a544a', marginBottom: 12 }}>{fund.category}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, background: '#0d0b07', borderRadius: 10, padding: 10, marginBottom: 12 }}>
        {[['1Y', fund.returns_1y], ['3Y', fund.returns_3y], ['5Y', fund.returns_5y]].map(([label, val]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: '#5a544a', margin: '0 0 2px' }}>{label} Return</p>
            <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: val != null ? (val >= 0 ? '#7fb069' : '#e7625f') : '#3a352c' }}>
              {val != null ? `${val > 0 ? '+' : ''}${val}%` : '—'}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#5a544a' }}>
        <span>ER: {fund.expense_ratio}%</span>
        <span>AUM: ₹{(fund.aum_cr / 1000).toFixed(1)}K Cr</span>
        <Link to={`/fund/${fund.scheme_code}`} style={{ color: '#e0aa3e', fontWeight: 600, textDecoration: 'none' }}>Details →</Link>
      </div>
    </div>
  )
}
