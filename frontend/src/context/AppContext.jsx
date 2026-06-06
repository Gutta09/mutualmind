import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem('mm_session_id')
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem('mm_session_id', id)
    return id
  })

  const [riskProfile, setRiskProfile] = useState(
    () => localStorage.getItem('mm_risk_profile') || null
  )
  const [quizResult, setQuizResult] = useState(
    () => {
      try { return JSON.parse(localStorage.getItem('mm_quiz_result')) } catch { return null }
    }
  )
  const [recommendations, setRecommendations] = useState(null)
  const [selectedFunds, setSelectedFunds] = useState([])

  function saveQuizResult(result) {
    setRiskProfile(result.risk_profile)
    setQuizResult(result)
    localStorage.setItem('mm_risk_profile', result.risk_profile)
    localStorage.setItem('mm_quiz_result', JSON.stringify(result))
  }

  return (
    <AppContext.Provider value={{
      sessionId,
      riskProfile,
      quizResult,
      saveQuizResult,
      recommendations,
      setRecommendations,
      selectedFunds,
      setSelectedFunds,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
