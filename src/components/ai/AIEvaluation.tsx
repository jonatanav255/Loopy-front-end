import type { TeachBackEvaluation } from '../../types/ai';

interface AIEvaluationProps {
  evaluation: TeachBackEvaluation;
  onDone: () => void;
}

export function AIEvaluation({ evaluation, onDone }: AIEvaluationProps) {
  const scores = [
    { label: 'Clarity', value: evaluation.clarityScore, color: 'bg-blue-500' },
    { label: 'Accuracy', value: evaluation.accuracyScore, color: 'bg-green-500' },
    { label: 'Completeness', value: evaluation.completenessScore, color: 'bg-purple-500' },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">AI Evaluation</h3>

      <div className="grid grid-cols-3 gap-4">
        {scores.map(s => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <div className="mx-auto mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="mb-1 text-sm font-medium text-blue-700">Feedback</p>
        <p className="text-sm text-blue-900 whitespace-pre-wrap">{evaluation.feedback}</p>
      </div>

      {evaluation.detectedGaps.length > 0 && (
        <div className="rounded-lg bg-orange-50 p-4">
          <p className="mb-2 text-sm font-medium text-orange-700">Detected Gaps</p>
          <ul className="space-y-1">
            {evaluation.detectedGaps.map((gap, i) => (
              <li key={i} className="text-sm text-orange-900">• {gap}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.followUpQuestions.length > 0 && (
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="mb-2 text-sm font-medium text-purple-700">Follow-up Questions</p>
          <ul className="space-y-1">
            {evaluation.followUpQuestions.map((q, i) => (
              <li key={i} className="text-sm text-purple-900">{i + 1}. {q}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onDone}
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Done
      </button>
    </div>
  );
}
