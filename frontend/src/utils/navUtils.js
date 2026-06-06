/**
 * Normalize all NAV series to start at 100 so they're comparable on one chart.
 */
export function indexedNAV(navData) {
  if (!navData || navData.length === 0) return []
  const base = navData[0].nav
  return navData.map(d => ({
    date: d.date,
    value: parseFloat(((d.nav / base) * 100).toFixed(2)),
  }))
}
