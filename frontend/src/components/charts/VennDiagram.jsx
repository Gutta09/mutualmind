import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getOverlap, overlapPercent } from '../../utils/overlapUtils'

const COLORS = ['#e0aa3e', '#7fb069', '#8b9dc3']

export default function VennDiagram({ funds = [] }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || funds.length < 2) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = 520, H = 320
    svg.attr('viewBox', `0 0 ${W} ${H}`)

    const r = funds.length === 3 ? 110 : 130
    const centers = funds.length === 2
      ? [{ x: W / 2 - 90, y: H / 2 }, { x: W / 2 + 90, y: H / 2 }]
      : [{ x: W / 2 - 95, y: H / 2 + 30 }, { x: W / 2 + 95, y: H / 2 + 30 }, { x: W / 2, y: H / 2 - 80 }]

    funds.forEach((fund, i) => {
      svg.append('circle')
        .attr('cx', centers[i].x).attr('cy', centers[i].y).attr('r', r)
        .attr('fill', COLORS[i]).attr('fill-opacity', 0.18)
        .attr('stroke', COLORS[i]).attr('stroke-width', 1.5)

      const lx = centers[i].x + (funds.length === 2 ? (i === 0 ? -(r + 16) : r + 16) : (i === 0 ? -(r + 10) : i === 1 ? r + 10 : 0))
      const ly = centers[i].y + (funds.length === 3 ? (i === 2 ? -(r + 14) : r + 22) : 0)

      svg.append('text').attr('x', lx).attr('y', ly)
        .attr('text-anchor', 'middle').attr('fill', COLORS[i])
        .attr('font-size', 11).attr('font-weight', '600')
        .text(fund.scheme_name?.split(' - ')[0]?.slice(0, 24))
    })

    if (funds.length >= 2) {
      const ov01 = getOverlap(funds[0].top_holdings || [], funds[1].top_holdings || [])
      renderOverlapText(svg, ov01, (centers[0].x + centers[1].x) / 2, (centers[0].y + centers[1].y) / 2)
    }
    if (funds.length === 3) {
      const ov02 = getOverlap(funds[0].top_holdings || [], funds[2].top_holdings || [])
      renderOverlapText(svg, ov02, (centers[0].x + centers[2].x) / 2, (centers[0].y + centers[2].y) / 2 + 10)

      const ov12 = getOverlap(funds[1].top_holdings || [], funds[2].top_holdings || [])
      renderOverlapText(svg, ov12, (centers[1].x + centers[2].x) / 2, (centers[1].y + centers[2].y) / 2 + 10)

      const tri = funds[0].top_holdings?.filter(h => funds[1].top_holdings?.includes(h) && funds[2].top_holdings?.includes(h)) || []
      const cx = (centers[0].x + centers[1].x + centers[2].x) / 3
      const cy = (centers[0].y + centers[1].y + centers[2].y) / 3
      if (tri.length) renderOverlapText(svg, tri, cx, cy + 10)
    }
  }, [funds])

  if (funds.length < 2) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#5a544a', fontSize: 13 }}>
        Select at least 2 funds to see overlap
      </div>
    )
  }

  const pct = overlapPercent(funds[0]?.top_holdings || [], funds[1]?.top_holdings || [])

  return (
    <div>
      <svg ref={svgRef} style={{ width: '100%', background: 'transparent' }} />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#8a8174', marginTop: 6 }}>
        Overlap score: <span style={{ fontWeight: 700, color: pct > 50 ? '#e7625f' : '#7fb069' }}>{pct}%</span>
        {pct > 50 && <span style={{ marginLeft: 8, color: '#e7625f', fontSize: 11 }}>High redundancy</span>}
      </p>
    </div>
  )
}

function renderOverlapText(svg, stocks, x, y) {
  if (!stocks.length) return
  stocks.slice(0, 3).forEach((stock, i) => {
    svg.append('text').attr('x', x).attr('y', y + i * 14)
      .attr('text-anchor', 'middle').attr('fill', '#e8e2d4')
      .attr('font-size', 10).text(stock)
  })
  if (stocks.length > 3) {
    svg.append('text').attr('x', x).attr('y', y + 3 * 14)
      .attr('text-anchor', 'middle').attr('fill', '#5a544a')
      .attr('font-size', 9).text(`+${stocks.length - 3} more`)
  }
}
