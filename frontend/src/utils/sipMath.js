/**
 * Monthly SIP required to reach a target corpus.
 * FV of ordinary annuity: FV = P * [((1+r)^n - 1) / r]
 */
export function monthlyRequired(targetAmount, years, annualReturnPct) {
  const r = annualReturnPct / 12 / 100
  const n = years * 12
  if (r === 0) return targetAmount / n
  return targetAmount * r / (Math.pow(1 + r, n) - 1)
}

/**
 * Year-by-year corpus growth data for the area chart.
 * Returns array of { year, invested, corpus } objects.
 */
export function corpusGrowthData(monthlySIP, years, annualReturnPct) {
  const r = annualReturnPct / 12 / 100
  const data = []
  for (let y = 1; y <= years; y++) {
    const n = y * 12
    const invested = monthlySIP * n
    const corpus = r === 0 ? invested : monthlySIP * ((Math.pow(1 + r, n) - 1) / r)
    data.push({ year: y, invested: Math.round(invested), corpus: Math.round(corpus) })
  }
  return data
}

export function formatINR(value) {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}
