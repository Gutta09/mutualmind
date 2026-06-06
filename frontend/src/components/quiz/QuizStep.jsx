export default function QuizStep({ question, onAnswer, selected }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 leading-snug">
        {question.text}
      </h2>
      <div className="space-y-2">
        {question.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
              selected === opt.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="font-bold text-indigo-600 mr-2">{opt.value}.</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
