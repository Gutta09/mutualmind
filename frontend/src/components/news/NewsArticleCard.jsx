const SENTIMENT = {
  bullish: { borderColor: '#7fb069', color: '#7fb069', bg: 'rgba(127,176,105,.1)', label: '↑ Bullish' },
  bearish: { borderColor: '#e7625f', color: '#e7625f', bg: 'rgba(231, 98, 95,.1)',  label: '↓ Bearish' },
  neutral: { borderColor: '#5a544a', color: '#8a8174', bg: 'rgba(90, 84, 74,.15)', label: '→ Neutral' },
}

export function SentimentGauge({ articles = [] }) {
  const counts = { bullish: 0, bearish: 0, neutral: 0 }
  articles.forEach(a => { counts[a.sentiment] = (counts[a.sentiment] || 0) + 1 })
  const total = articles.length || 1

  return (
    <div style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 14, padding: 16, marginBottom: 14 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#5a544a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Overall Sentiment</p>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1, marginBottom: 8 }}>
        <div style={{ background: '#7fb069', width: `${(counts.bullish / total) * 100}%`, transition: 'width .3s', borderRadius: '4px 0 0 4px' }} />
        <div style={{ background: '#5a544a', width: `${(counts.neutral / total) * 100}%`, transition: 'width .3s' }} />
        <div style={{ background: '#e7625f', width: `${(counts.bearish / total) * 100}%`, transition: 'width .3s', borderRadius: '0 4px 4px 0' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
        {[['bullish','#7fb069'],['neutral','#8a8174'],['bearish','#e7625f']].map(([k, c]) => (
          <span key={k} style={{ color: c, fontWeight: 600 }}>{k.charAt(0).toUpperCase() + k.slice(1)}: {counts[k]}</span>
        ))}
      </div>
    </div>
  )
}

export default function NewsArticleCard({ article }) {
  const s = SENTIMENT[article.sentiment] || SENTIMENT.neutral
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : ''

  return (
    <div style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderLeft: `3px solid ${s.borderColor}`, borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <a href={article.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, fontWeight: 600, color: '#e8e2d4', textDecoration: 'none', lineHeight: 1.45 }}
          onMouseEnter={e => e.target.style.color = '#e0aa3e'}
          onMouseLeave={e => e.target.style.color = '#e8e2d4'}>
          {article.title}
        </a>
        <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.borderColor}30`, borderRadius: 999, padding: '4px 10px' }}>
          {s.label}
        </span>
      </div>
      {article.description && (
        <p style={{ fontSize: 12, color: '#5a544a', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#3a352c' }}>
        <span>{article.source} · {date}</span>
        {article.sentiment_reason && (
          <span style={{ color: '#5a544a', fontStyle: 'italic', textAlign: 'right', maxWidth: 260 }}>{article.sentiment_reason}</span>
        )}
      </div>
    </div>
  )
}
