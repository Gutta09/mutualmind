import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getOverlap, overlapPercent } from '../../utils/overlapUtils'

const COLORS = ['#6366f1', '#f59e0b', '#10b981']
const OPACITY = 0.25

export default function VennDiagram({ funds = [] }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || funds.length < 2) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = 520, H = 320
    svg.attr('viewBox', `0 0 ${W} ${H}`)

    const r = funds.length === 3 ? 110 : 130
    // Circle centers
    const centers =
      funds.length === 2
        ? [
            { x: W / 2 - 90, y: H / 2 },
            { x: W / 2 + 90, y: H / 2 },
          ]
        : [
            { x: W / 2 - 95, y: H / 2 + 30 },
            { x: W / 2 + 95, y: H / 2 + 30 },
            { x: W / 2,      y: H / 2 - 80 },
          ]

    // Draw circles
    funds.forEach((fund, i) => {
      svg.append('circle')
        .attr('cx', centers[i].x)
        .attr('cy', centers[i].y)
        .attr('r', r)
        .attr('fill', COLORS[i])
        .attr('fill-opacity', OPACITY)
        .attr('stroke', COLORS[i])
        .attr('stroke-width', 2)

      // Fund label outside the circle
      const labelOffset = funds.length === 2
        ? (i === 0 ? -r - 16 : r + 16)
        : 0
      const lx = centers[i].x + (funds.length === 2 ? labelOffset : (i === 0 ? -r - 10 : i === 1 ? r + 10 : 0))
      const ly = centers[i].y + (funds.length === 3 ? (i === 2 ? -(r + 14) : r + 22) : 0)

      svg.append('text')
        .attr('x', lx)
        .attr('y', ly)
        .attr('text-anchor', 'middle')
        .attr('fill', COLORS[i])
        .attr('font-size', 11)
        .attr('font-weight', '600')
        .text(fund.scheme_name?.split(' - ')[0]?.slice(0, 24))
    })

    // Overlap labels in intersection zones
    if (funds.length >= 2) {
      const overlap01 = getOverlap(funds[0].top_holdings || [], funds[1].top_holdings || [])
      const midX01 = (centers[0].x + centers[1].x) / 2
      const midY01 = (centers[0].y + centers[1].y) / 2
      renderOverlapText(svg, overlap01, midX01, midY01)
    }

    if (funds.length === 3) {
      const overlap02 = getOverlap(funds[0].top_holdings || [], funds[2].top_holdings || [])
      const midX02 = (centers[0].x + centers[2].x) / 2
      const midY02 = (centers[0].y + centers[2].y) / 2 + 10
      renderOverlapText(svg, overlap02, midX02, midY02)

      const overlap12 = getOverlap(funds[1].top_holdings || [], funds[2].top_holdings || [])
      const midX12 = (centers[1].x + centers[2].x) / 2
      const midY12 = (centers[1].y + centers[2].y) / 2 + 10
      renderOverlapText(svg, overlap12, midX12, midY12)

      // Triple overlap
      const tripleOverlap = funds[0].top_holdings?.filter(h =>
        funds[1].top_holdings?.includes(h) && funds[2].top_holdings?.includes(h)
      ) || []
      const cx = (centers[0].x + centers[1].x + centers[2].x) / 3
      const cy = (centers[0].y + centers[1].y + centers[2].y) / 3
      if (tripleOverlap.length) {
        renderOverlapText(svg, tripleOverlap, cx, cy + 10)
      }
    }
  }, [funds])

  if (funds.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Select at least 2 funds to see overlap
      </div>
    )
  }

  const pct = overlapPercent(funds[0]?.top_holdings || [], funds[1]?.top_holdings || [])

  return (
    <div>
      <svg ref={svgRef} className="w-full" />
      <p className="text-center text-sm text-slate-500 mt-2">
        Overlap score: <span className={`font-bold ${pct > 50 ? 'text-red-500' : 'text-emerald-600'}`}>{pct}%</span>
        {pct > 50 && <span className="ml-2 text-red-500 text-xs">⚠ High redundancy</span>}
      </p>
    </div>
  )
}

function renderOverlapText(svg, stocks, x, y) {
  if (!stocks.length) return
  const visible = stocks.slice(0, 3)
  visible.forEach((stock, i) => {
    svg.append('text')
      .attr('x', x)
      .attr('y', y + i * 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', 10)
      .text(stock)
  })
  if (stocks.length > 3) {
    svg.append('text')
      .attr('x', x)
      .attr('y', y + 3 * 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', 9)
      .text(`+${stocks.length - 3} more`)
  }
}
