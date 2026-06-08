import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import api from '../utils/api'

const QUESTIONS = [
  {
    id: 1,
    text: 'What is your primary investment goal?',
    options: [
      { value: 'A', label: 'Preserve my money with minimal risk' },
      { value: 'B', label: 'Save for a big purchase (house, car) in 5–10 years' },
      { value: 'C', label: 'Build long-term wealth (10–20 years)' },
      { value: 'D', label: 'Maximize returns — I have a long horizon and high risk appetite' },
    ],
  },
  {
    id: 2,
    text: 'How many years are you planning to stay invested?',
    options: [
      { value: 'A', label: 'Less than 3 years' },
      { value: 'B', label: '3 to 5 years' },
      { value: 'C', label: '5 to 10 years' },
      { value: 'D', label: 'More than 10 years' },
    ],
  },
  {
    id: 3,
    text: "If your portfolio drops 25% in a market crash, you would:",
    options: [
      { value: 'A', label: "Sell everything immediately — I can't handle this loss" },
      { value: 'B', label: 'Worry a lot but hold and wait for recovery' },
      { value: 'C', label: "Stay calm — markets recover. I'll hold my position" },
      { value: 'D', label: 'See it as an opportunity and invest more' },
    ],
  },
  {
    id: 4,
    text: 'What percentage of your monthly savings are you comfortable investing in equity mutual funds?',
    options: [
      { value: 'A', label: 'Less than 10%' },
      { value: 'B', label: '10% to 25%' },
      { value: 'C', label: '25% to 50%' },
      { value: 'D', label: 'More than 50%' },
    ],
  },
  {
    id: 5,
    text: 'Which statement best describes your investment experience?',
    options: [
      { value: 'A', label: 'I only keep money in bank FDs — never invested before' },
      { value: 'B', label: "I have a few mutual funds / SIPs but don't monitor them closely" },
      { value: 'C', label: 'I actively track my portfolio and understand market cycles' },
      { value: 'D', label: 'I actively trade stocks and understand equity markets well' },
    ],
  },
]

const GOAL_OPTIONS = ['Retirement', 'House', 'Education', 'Wealth Creation', 'Emergency Fund']

const PROFILE_META = {
  Conservative: { color: '#7fb069', icon: '🛡️', desc: 'You value capital safety above everything else. Suitable for debt-heavy, stable portfolios.' },
  Moderate:     { color: '#e0aa3e', icon: '⚖️', desc: 'You want growth but with a safety net. A balanced equity-debt mix suits you well.' },
  Aggressive:   { color: '#e7625f', icon: '🚀', desc: 'You\'re comfortable with volatility and aim for maximum long-term returns through equity.' },
}

export default function Quiz() {
  const navigate = useNavigate()
  const { sessionId, saveQuizResult } = useApp()

  const [step, setStep]           = useState(0)
  const [goal, setGoal]           = useState('')
  const [horizon, setHorizon]     = useState(10)
  const [answers, setAnswers]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]       = useState(null)

  const totalSteps = QUESTIONS.length + 1
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100)

  async function handleAnswer(questionIndex, answer) {
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)
    if (questionIndex < QUESTIONS.length - 1) { setStep(questionIndex + 2); return }
    setSubmitting(true)
    try {
      const payload = {
        session_id: sessionId,
        answers: QUESTIONS.map((q, i) => ({ question_id: q.id, answer: newAnswers[i] || 'B' })),
        investment_goal: goal,
        horizon_years: horizon,
      }
      const { data } = await api.post('/api/quiz/submit', payload)
      saveQuizResult(data)
      setResult(data)
      setStep(totalSteps + 1)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const card = { background: 'linear-gradient(160deg,#16130d,#100d08)', border: '1px solid #25211a', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 520 }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0b07', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative' }}>

      {/* Glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(224,170,62,.06),transparent 70%)', pointerEvents: 'none' }} />

      <div style={card} className="card-rise">

        {/* Goal form — step 0 */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#e0aa3e', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Risk Profile Quiz</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif', margin: '0 0 6px' }}>Let's build your profile</h1>
              <p style={{ fontSize: 13, color: '#5a544a', margin: 0 }}>5 quick questions to personalize your experience</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#8a8174', display: 'block', marginBottom: 10, letterSpacing: '.3px' }}>PRIMARY GOAL</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {GOAL_OPTIONS.map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    style={{ fontSize: 13, padding: '11px 12px', borderRadius: 11, border: `2px solid ${goal === g ? '#e0aa3e' : '#25211a'}`, background: goal === g ? 'rgba(224,170,62,.1)' : '#1a1610', color: goal === g ? '#e0aa3e' : '#8a8174', fontWeight: goal === g ? 700 : 500, cursor: 'pointer', transition: 'all .15s', textAlign: 'left' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 12, color: '#8a8174', letterSpacing: '.3px' }}>INVESTMENT HORIZON</label>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#e0aa3e', fontFamily: 'Georgia, serif' }}>{horizon} years</span>
              </div>
              <input type="range" min={3} max={25} step={1} value={horizon} onChange={e => setHorizon(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#3a352c', marginTop: 4 }}>
                <span>3 yr</span><span>25 yr</span>
              </div>
            </div>

            <button onClick={() => goal && setStep(1)} disabled={!goal}
              style={{ width: '100%', background: goal ? '#e0aa3e' : '#1c1810', color: goal ? '#0d0b07' : '#3a352c', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: goal ? 'pointer' : 'default', transition: 'all .15s' }}>
              Start Quiz →
            </button>
          </div>
        )}

        {/* Questions — steps 1–5 */}
        {step >= 1 && step <= QUESTIONS.length && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5a544a', marginBottom: 8 }}>
                <span>Question {step} of {QUESTIONS.length}</span>
                <span style={{ color: '#e0aa3e', fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ height: 3, background: '#25211a', borderRadius: 2 }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#e0aa3e', borderRadius: 2, transition: 'width .3s' }} />
              </div>
            </div>

            {/* Question */}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e8e2d4', fontFamily: 'Georgia, serif', lineHeight: 1.5, marginBottom: 20 }}>
              {QUESTIONS[step - 1].text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUESTIONS[step - 1].options.map(opt => (
                <button key={opt.value} onClick={() => !submitting && handleAnswer(step - 1, opt.value)}
                  disabled={submitting}
                  style={{ padding: '13px 16px', borderRadius: 12, border: `1px solid ${answers[step-1] === opt.value ? '#e0aa3e' : '#25211a'}`, background: answers[step-1] === opt.value ? 'rgba(224,170,62,.1)' : '#1a1610', color: answers[step-1] === opt.value ? '#e0aa3e' : '#c9c2b4', fontSize: 13, fontWeight: 500, textAlign: 'left', cursor: submitting ? 'default' : 'pointer', transition: 'all .15s', lineHeight: 1.4 }}
                  onMouseEnter={e => { if (answers[step-1] !== opt.value) { e.currentTarget.style.borderColor = '#3a352c'; e.currentTarget.style.color = '#e8e2d4' } }}
                  onMouseLeave={e => { if (answers[step-1] !== opt.value) { e.currentTarget.style.borderColor = '#25211a'; e.currentTarget.style.color = '#c9c2b4' } }}>
                  <span style={{ fontSize: 11, color: '#5a544a', fontWeight: 700, marginRight: 8 }}>{opt.value}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            {submitting && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#5a544a', marginTop: 16 }}>Calculating your profile…</p>
            )}

            {step > 1 && !submitting && (
              <button onClick={() => setStep(step - 1)}
                style={{ marginTop: 16, fontSize: 12, color: '#5a544a', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {result && (() => {
          const meta = PROFILE_META[result.risk_profile] || PROFILE_META.Moderate
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>{meta.icon}</div>
              <div style={{ fontSize: 11, color: '#5a544a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Your Risk Profile</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: meta.color, fontFamily: 'Georgia, serif', margin: '0 0 12px' }}>{result.risk_profile}</h2>
              <p style={{ fontSize: 13, color: '#8a8174', lineHeight: 1.65, marginBottom: 20 }}>{meta.desc}</p>

              <div style={{ background: '#1a1610', border: '1px solid #25211a', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#8a8174', marginBottom: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
                <span><span style={{ color: '#5a544a' }}>Goal: </span><span style={{ color: '#c9c2b4', fontWeight: 600 }}>{result.investment_goal}</span></span>
                <span>·</span>
                <span><span style={{ color: '#5a544a' }}>Horizon: </span><span style={{ color: '#c9c2b4', fontWeight: 600 }}>{result.horizon_years} years</span></span>
              </div>

              <button onClick={() => navigate('/dashboard')}
                style={{ width: '100%', background: '#e0aa3e', color: '#0d0b07', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: '.3px' }}>
                See My Dashboard →
              </button>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
