import { Link } from 'react-router-dom'
import { RiskBadge } from '../ui/Navbar'

export default function FundCard({ fund }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs text-slate-500">{fund.fund_house}</p>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug">
            {fund.scheme_name.split(' - ')[0]}
          </h3>
        </div>
        <RiskBadge profile={fund.risk_label} />
      </div>
      <p className="text-xs text-slate-500 mb-3">{fund.category}</p>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        {[['1Y', fund.returns_1y], ['3Y', fund.returns_3y], ['5Y', fund.returns_5y]].map(([label, val]) => (
          <div key={label} className="bg-slate-50 rounded-lg py-1.5">
            <p className="text-xs text-slate-400">{label} Return</p>
            <p className={`text-sm font-bold ${val >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {val != null ? `${val > 0 ? '+' : ''}${val}%` : '—'}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>ER: {fund.expense_ratio}%</span>
        <span>AUM: ₹{(fund.aum_cr / 1000).toFixed(1)}K Cr</span>
        <Link
          to={`/fund/${fund.scheme_code}`}
          className="text-indigo-600 font-medium hover:underline"
        >
          Details →
        </Link>
      </div>
    </div>
  )
}
