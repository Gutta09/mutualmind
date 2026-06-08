import { useState } from 'react'
import { useFunds } from '../hooks/useFunds'
import FundSelector from '../components/funds/FundSelector'
import VennDiagram from '../components/charts/VennDiagram'
import { getOverlap } from '../utils/overlapUtils'
import { S } from '../utils/theme'

export default function OverlapVisualizer() {
  const [selectedCodes, setSelectedCodes] = useState([])
  const { funds, loading } = useFunds()

  const selectedFunds = selectedCodes
    .map(code => funds.find(f => f.scheme_code === code))
    .filter(Boolean)

  const allOverlaps = []
  for (let i = 0; i < selectedFunds.length; i++) {
    for (let j = i + 1; j < selectedFunds.length; j++) {
      const shared = getOverlap(selectedFunds[i].top_holdings || [], selectedFunds[j].top_holdings || [])
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
    <div style={{ ...S.page, maxWidth: 900 }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={S.h1}>Portfolio Overlap</h1>
        <p style={{ fontSize: 13, color: 'var(--text4)', margin: 0 }}>See which stocks your funds share — avoid unknowing redundancy</p>
      </div>

      <div style={{ ...S.panel, marginBottom: 20 }}>
        <div style={S.panelHead}>
          <div>
            <p style={S.panelTitle}>Select Funds</p>
            <p style={S.panelSub}>Pick 2–3 funds to visualize their holding overlap</p>
          </div>
          <span style={S.badge}>max 3</span>
        </div>
        {loading ? (
          <div style={{ height: 44, background: 'var(--card-inner)', borderRadius: 10, opacity: 0.5 }} />
        ) : (
          <FundSelector funds={funds} selected={selectedCodes} onChange={setSelectedCodes} maxFunds={3} placeholder="Search funds..." />
        )}
      </div>

      {selectedFunds.length >= 2 && (
        <div style={{ ...S.panel, marginBottom: 20 }}>
          <VennDiagram funds={selectedFunds} />
        </div>
      )}

      {allOverlaps.length > 0 && (
        <div style={{ ...S.panel, marginBottom: 20 }}>
          <p style={{ ...S.panelTitle, marginBottom: 16 }}>Overlapping Holdings Detail</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {allOverlaps.map((pair, i) => (
              <div key={i}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text2)' }}>{pair.a}</span>
                  <span style={{ color: 'var(--text4)', margin: '0 8px' }}>∩</span>
                  <span style={{ color: 'var(--text2)' }}>{pair.b}</span>
                  <span style={{ fontSize: 11, color: '#e0aa3e', fontWeight: 700, marginLeft: 10 }}>{pair.stocks.length} common stocks</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {pair.stocks.map(stock => (
                    <span key={stock} style={{ fontSize: 11, background: 'rgba(224,170,62,.1)', border: '1px solid rgba(224,170,62,.2)', color: '#e0aa3e', borderRadius: 999, padding: '4px 10px', fontWeight: 600 }}>
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
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔵</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'Georgia, serif' }}>Select 2–3 funds to visualize overlap</p>
          <p style={{ fontSize: 13, color: 'var(--text4)', marginTop: 6 }}>Large cap and index funds typically have 60–80% overlap</p>
        </div>
      )}
    </div>
  )
}
