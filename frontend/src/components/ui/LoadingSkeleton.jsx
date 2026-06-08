export function Skeleton({ style = {} }) {
  return <div style={{ background: 'var(--border3)', borderRadius: 8, ...style }} />
}

export function CardSkeleton() {
  return (
    <div style={{ background: 'var(--panel-grad)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton style={{ height: 14, width: '60%' }} />
      <Skeleton style={{ height: 10, width: '40%' }} />
      <Skeleton style={{ height: 40, width: '100%', marginTop: 6 }} />
    </div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 12, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: 'var(--muted)' }}>Loading chart…</div>
    </div>
  )
}
