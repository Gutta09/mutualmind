import { useState, useEffect } from 'react'
import api from '../utils/api'

export function useNAV(codes = [], period = '1y') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!codes.length) { setData([]); return }
    setLoading(true)
    setError(null)
    api.get('/api/funds/compare/nav', { params: { codes: codes.join(','), period } })
      .then(r => { setData(r.data.funds); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [codes.join(','), period])

  return { data, loading, error }
}
