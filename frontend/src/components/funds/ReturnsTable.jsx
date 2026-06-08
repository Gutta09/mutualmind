const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y']
const PERIOD_LABELS = { '1m': '1 Month', '3m': '3 Month', '6m': '6 Month', '1y': '1 Year', '3y': '3 Year', '5y': '5 Year' }
const COLORS = ['text-indigo-600', 'text-amber-600', 'text-emerald-600', 'text-rose-600', 'text-violet-600']

export default function ReturnsTable({ funds = [] }) {
  if (!funds.length) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 text-slate-500 font-medium">Period</th>
            {funds.map((f, i) => (
              <th key={i} className={`text-right py-2 px-3 font-semibold ${COLORS[i]}`}>
                {f.scheme_name?.split(' - ')[0]?.slice(0, 18)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map(period => {
            const values = funds.map(f => f.returns?.[period])
            const defined = values.filter(v => v != null)
            const best = defined.length ? Math.max(...defined) : null
            const worst = defined.length ? Math.min(...defined) : null

            return (
              <tr key={period} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 text-slate-600 font-medium">{PERIOD_LABELS[period]}</td>
                {values.map((v, i) => (
                  <td key={i} className="text-right py-2 px-3">
                    {v == null ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <span className={`font-semibold ${
                        v === best && best !== worst ? 'text-emerald-600' :
                        v === worst && best !== worst ? 'text-red-500' :
                        'text-slate-700'
                      }`}>
                        {v > 0 ? '+' : ''}{v.toFixed(2)}%
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
