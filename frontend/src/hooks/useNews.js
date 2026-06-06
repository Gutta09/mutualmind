import { useState, useEffect } from 'react'
import api from '../utils/api'

export function useNews(schemeCode) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!schemeCode) return
    setLoading(true)
    setError(null)
    api.get(`/api/funds/${schemeCode}/news`)
      .then(r => { setData(r.data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [schemeCode])

  return { data, loading, error }
}
