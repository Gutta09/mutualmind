const OPTION_ICONS = { A: '🔵', B: '🟡', C: '🟠', D: '🔴' }

export default function QuizStep({ question, onAnswer, selected }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 leading-snug">
        {question.text}
      </h2>
      <div className="space-y-2.5">
        {question.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 ${
              selected === opt.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-base shrink-0">{OPTION_ICONS[opt.value]}</span>
            {opt.label}
            {selected === opt.value && (
              <span className="ml-auto text-indigo-600 font-bold">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
