export function Skeleton({ style = {} }) {
  return <div style={{ background: '#1e1b15', borderRadius: 8, ...style }} />
}

export function CardSkeleton() {
  return (
    <div style={{ background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton style={{ height: 14, width: '60%' }} />
      <Skeleton style={{ height: 10, width: '40%' }} />
      <Skeleton style={{ height: 40, width: '100%', marginTop: 6 }} />
    </div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div style={{ background: '#0d0b07', borderRadius: 12, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: '#3a352c' }}>Loading chart…</div>
    </div>
  )
}
