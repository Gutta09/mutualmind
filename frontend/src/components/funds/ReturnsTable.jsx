import { COLORS } from '../../utils/theme'

const PERIODS = ['1m', '3m', '6m', '1y', '3y', '5y']
const PERIOD_LABELS = { '1m': '1 Month', '3m': '3 Month', '6m': '6 Month', '1y': '1 Year', '3y': '3 Year', '5y': '5 Year' }

export default function ReturnsTable({ funds = [] }) {
  if (!funds.length) return null

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text4)', fontWeight: 600 }}>Period</th>
            {funds.map((f, i) => (
              <th key={i} style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                {f.scheme_name?.split(' - ')[0]?.slice(0, 18)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map(period => {
            const values = funds.map(f => f.returns?.[period])
            const defined = values.filter(v => v != null)
            const best  = defined.length ? Math.max(...defined) : null
            const worst = defined.length ? Math.min(...defined) : null

            return (
              <tr key={period} style={{ borderBottom: '1px solid #1e1b15' }}>
                <td style={{ padding: '9px 12px', color: 'var(--text3)', fontWeight: 600 }}>{PERIOD_LABELS[period]}</td>
                {values.map((v, i) => (
                  <td key={i} style={{ textAlign: 'right', padding: '9px 12px' }}>
                    {v == null ? (
                      <span style={{ color: 'var(--muted)' }}>—</span>
                    ) : (
                      <span style={{ fontWeight: 700, color: v === best && best !== worst ? '#7fb069' : v === worst && best !== worst ? '#e7625f' : 'var(--text2)' }}>
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
