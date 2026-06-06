const SENTIMENT_STYLES = {
  bullish:  { border: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-800', label: '↑ Bullish' },
  bearish:  { border: 'border-l-red-500',     badge: 'bg-red-100 text-red-800',         label: '↓ Bearish' },
  neutral:  { border: 'border-l-slate-400',   badge: 'bg-slate-100 text-slate-600',     label: '→ Neutral' },
}

export function SentimentGauge({ articles = [] }) {
  const counts = { bullish: 0, bearish: 0, neutral: 0 }
  articles.forEach(a => { counts[a.sentiment] = (counts[a.sentiment] || 0) + 1 })
  const total = articles.length || 1

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Overall Sentiment</p>
      <div className="flex rounded-full overflow-hidden h-4">
        <div className="bg-emerald-500 transition-all" style={{ width: `${(counts.bullish / total) * 100}%` }} title={`Bullish: ${counts.bullish}`} />
        <div className="bg-slate-300 transition-all" style={{ width: `${(counts.neutral / total) * 100}%` }} title={`Neutral: ${counts.neutral}`} />
        <div className="bg-red-500 transition-all" style={{ width: `${(counts.bearish / total) * 100}%` }} title={`Bearish: ${counts.bearish}`} />
      </div>
      <div className="flex gap-4 mt-2 text-xs">
        {[['bullish', 'text-emerald-600'], ['neutral', 'text-slate-500'], ['bearish', 'text-red-600']].map(([k, cls]) => (
          <span key={k} className={cls}>{k.charAt(0).toUpperCase() + k.slice(1)}: {counts[k]}</span>
        ))}
      </div>
    </div>
  )
}

export default function NewsArticleCard({ article }) {
  const style = SENTIMENT_STYLES[article.sentiment] || SENTIMENT_STYLES.neutral
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : ''

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${style.border} p-4`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-slate-800 hover:text-indigo-600 leading-snug"
        >
          {article.title}
        </a>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
          {style.label}
        </span>
      </div>
      {article.description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{article.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{article.source} · {date}</span>
        {article.sentiment_reason && (
          <span className="italic text-slate-400 text-right max-w-xs">{article.sentiment_reason}</span>
        )}
      </div>
    </div>
  )
}
