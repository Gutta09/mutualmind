export function getOverlap(holdingsA, holdingsB) {
  const setA = new Set(holdingsA)
  return holdingsB.filter(h => setA.has(h))
}

export function overlapPercent(holdingsA, holdingsB) {
  if (!holdingsA.length || !holdingsB.length) return 0
  const overlap = getOverlap(holdingsA, holdingsB)
  const union = new Set([...holdingsA, ...holdingsB])
  return Math.round((overlap.length / union.size) * 100)
}
