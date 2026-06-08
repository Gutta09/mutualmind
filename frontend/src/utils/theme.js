export const tooltipStyle = {
  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
  color: 'var(--text)', fontSize: 12, boxShadow: '0 8px 30px rgba(0,0,0,.5)',
}

export const S = {
  page:      { padding: '28px 24px 60px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 },
  panel:     { background: 'var(--panel-grad)', border: '1px solid var(--border)', borderRadius: 18, padding: 22 },
  panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  panelTitle:{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--text)', fontFamily: 'Georgia, serif' },
  panelSub:  { fontSize: 12, color: 'var(--text3)', margin: '3px 0 0' },
  badge:     { fontSize: 10, color: 'var(--text2)', border: '1px solid var(--muted)', borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap' },
  input:     { background: 'var(--card-inner)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%' },
  btn:       { background: '#e0aa3e', color: 'var(--on-accent)', border: 'none', borderRadius: 11, padding: '11px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '.3px' },
  btnGhost:  { background: 'var(--card-inner)', border: '1px solid var(--muted)', color: 'var(--text2)', borderRadius: 9, padding: '8px 14px', fontSize: 12, cursor: 'pointer' },
  h1:        { fontSize: 28, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'Georgia, serif' },
  label:     { fontSize: 12, color: 'var(--text3)', letterSpacing: '.5px' },
}

export const COLORS = ['#e0aa3e', '#7fb069', 'var(--text2)', '#e7625f', '#8b9dc3']
