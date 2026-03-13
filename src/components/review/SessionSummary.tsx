import { useI18n } from '../../contexts/I18nContext';
import type { ReviewResponse } from '../../types/review';

interface SessionSummaryProps {
  results: ReviewResponse[];
  onDone: () => void;
  onPracticeAgain?: () => void;
}

export function SessionSummary({ results, onDone, onPracticeAgain }: SessionSummaryProps) {
  const { t } = useI18n();
  const total = results.length;
  const passed = results.filter(r => r.rating >= 3).length;
  const accuracy = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="text-2xl font-bold text-content">{t.review.sessionComplete}</h2>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-indigo-600">{total}</p>
          <p className="text-xs text-content-muted">{t.dashboard.reviewed}</p>
        </div>
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{passed}</p>
          <p className="text-xs text-content-muted">{t.dashboard.passed}</p>
        </div>
        <div className="rounded-lg bg-surface p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
          <p className="text-xs text-content-muted">{t.dashboard.accuracy}</p>
        </div>
      </div>
      <div className="mt-8 flex gap-3 justify-center">
        {onPracticeAgain && (
          <button onClick={onPracticeAgain} className="rounded-lg border border-indigo-600 px-6 py-3 text-sm font-medium text-indigo-400 hover:bg-indigo-600/10">
            {t.review.practiceAgain}
          </button>
        )}
        <button onClick={onDone} className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
          {t.review.backToDashboard}
        </button>
      </div>
    </div>
  );
}
