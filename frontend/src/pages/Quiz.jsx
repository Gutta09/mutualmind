import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizProgressBar from '../components/quiz/QuizProgressBar'
import QuizStep from '../components/quiz/QuizStep'
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
    text: 'If your portfolio drops 25% in a market crash, you would:',
    options: [
      { value: 'A', label: 'Sell everything immediately — I can\'t handle this loss' },
      { value: 'B', label: 'Worry a lot but hold and wait for recovery' },
      { value: 'C', label: 'Stay calm — markets recover. I\'ll hold my position' },
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
      { value: 'B', label: 'I have a few mutual funds / SIPs but don\'t monitor them closely' },
      { value: 'C', label: 'I actively track my portfolio and understand market cycles' },
      { value: 'D', label: 'I actively trade stocks and understand equity markets well' },
    ],
  },
]

const GOAL_OPTIONS = ['Retirement', 'House', 'Education', 'Wealth Creation', 'Emergency Fund']
const HORIZON_OPTIONS = [3, 5, 7, 10, 15, 20]

export default function Quiz() {
  const navigate = useNavigate()
  const { sessionId, saveQuizResult } = useApp()

  const [step, setStep] = useState(0) // 0 = goal form, 1–5 = questions, 6 = result
  const [goal, setGoal] = useState('')
  const [horizon, setHorizon] = useState(10)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const totalSteps = QUESTIONS.length + 1 // +1 for goal form

  async function handleAnswer(questionIndex, answer) {
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)

    if (questionIndex < QUESTIONS.length - 1) {
      setStep(questionIndex + 2)
      return
    }

    // Last answer — submit
    setSubmitting(true)
    try {
      const payload = {
        session_id: sessionId,
        answers: QUESTIONS.map((q, i) => ({
          question_id: q.id,
          answer: newAnswers[i] || 'B',
        })),
        investment_goal: goal,
        horizon_years: horizon,
      }
      const { data } = await api.post('/api/quiz/submit', payload)
      saveQuizResult(data)
      setResult(data)
      setStep(totalSteps + 1)
    } catch (e) {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const PROFILE_COLORS = {
    Conservative: 'text-emerald-600',
    Moderate: 'text-amber-600',
    Aggressive: 'text-red-600',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-8">

        {/* Goal form — step 0 */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Let's build your profile</h1>
              <p className="text-slate-500 text-sm">5 quick questions to personalize your experience</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary goal</label>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_OPTIONS.map(g => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-sm py-2.5 px-3 rounded-lg border-2 font-medium transition-all ${
                      goal === g ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Investment horizon: <span className="text-indigo-600 font-bold">{horizon} years</span></label>
              <input
                type="range" min={3} max={25} step={1}
                value={horizon}
                onChange={e => setHorizon(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>3 yr</span><span>25 yr</span>
              </div>
            </div>
            <button
              onClick={() => goal && setStep(1)}
              disabled={!goal}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-indigo-700 transition-colors"
            >
              Start Quiz →
            </button>
          </div>
        )}

        {/* Questions — steps 1–5 */}
        {step >= 1 && step <= QUESTIONS.length && (
          <div className="space-y-6">
            <QuizProgressBar step={step} total={QUESTIONS.length} />
            <QuizStep
              question={QUESTIONS[step - 1]}
              onAnswer={ans => handleAnswer(step - 1, ans)}
              selected={answers[step - 1]}
            />
            {submitting && (
              <p className="text-center text-sm text-slate-500 animate-pulse">Calculating your profile...</p>
            )}
            {step > 1 && !submitting && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="text-center space-y-4">
            <div className="text-5xl">🎯</div>
            <h2 className="text-2xl font-bold text-slate-800">Your Risk Profile</h2>
            <p className={`text-4xl font-extrabold ${PROFILE_COLORS[result.risk_profile] || 'text-indigo-600'}`}>
              {result.risk_profile}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">{result.description}</p>
            <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
              <span className="font-medium">Goal:</span> {result.investment_goal} ·{' '}
              <span className="font-medium">Horizon:</span> {result.horizon_years} years
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              See My Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
