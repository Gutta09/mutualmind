import { useState, useEffect } from 'react'
import api from '../utils/api'

export function useFunds(filters = {}) {
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v != null && v !== '')
    )
    api.get('/api/funds', { params })
      .then(r => { setFunds(r.data.funds); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [JSON.stringify(filters)])

  return { funds, loading, error }
}
