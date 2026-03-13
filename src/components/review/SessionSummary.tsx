import type { ReviewResponse } from '../../types/review';

interface SessionSummaryProps {
  results: ReviewResponse[];
  onDone: () => void;
}

export function SessionSummary({ results, onDone }: SessionSummaryProps) {
  const total = results.length;
  const passed = results.filter(r => r.rating >= 3).length;
  const accuracy = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="text-2xl font-bold text-content">Session Complete</h2>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-indigo-600">{total}</p>
          <p className="text-xs text-content-muted">Reviewed</p>
        </div>
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{passed}</p>
          <p className="text-xs text-content-muted">Passed</p>
        </div>
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
          <p className="text-xs text-content-muted">Accuracy</p>
        </div>
      </div>
      <button onClick={onDone} className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
        Back to Dashboard
      </button>
    </div>
  );
}
