// Dependencies: useNavigate, useCallback — see DEPENDENCY_GUIDE.md
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewSession } from '../hooks/useReviewSession';
import { useKeyboard } from '../hooks/useKeyboard';
import { ReviewCard } from '../components/review/ReviewCard';
import { RatingButtons } from '../components/review/RatingButtons';
import { ConfidenceRating } from '../components/review/ConfidenceRating';
import { ProgressBar } from '../components/review/ProgressBar';
import { SessionSummary } from '../components/review/SessionSummary';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ReviewPage() {
  const navigate = useNavigate();
  const session = useReviewSession();

  const handleKeyboard = useCallback((key: string) => {
    if (session.phase === 'front' && key === ' ') {
      session.reveal();
    } else if (session.phase === 'back') {
      const num = parseInt(key);
      if (num >= 1 && num <= 6) session.rate(num - 1);
    } else if (session.phase === 'confidence') {
      const num = parseInt(key);
      if (num >= 1 && num <= 3) session.submitConfidence(num);
    }
  }, [session]);

  useKeyboard(handleKeyboard);

  // Idle — show launcher
  if (session.phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-semibold text-gray-900">Review Session</h2>
        <p className="mt-2 text-gray-600">Review your due flashcards with spaced repetition.</p>
        <button
          onClick={session.loadCards}
          className="mt-6 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Start Review
        </button>
      </div>
    );
  }

  if (session.phase === 'loading') return <LoadingSpinner className="py-20" />;

  // Done — show summary
  if (session.phase === 'done') {
    if (session.results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900">All caught up!</h2>
          <p className="mt-2 text-gray-600">No cards due for review today.</p>
          <button onClick={() => navigate('/')} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            Back to Dashboard
          </button>
        </div>
      );
    }
    return (
      <div className="py-20">
        <SessionSummary results={session.results} onDone={() => navigate('/')} />
      </div>
    );
  }

  // Active session — full-screen overlay
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button onClick={session.reset} className="text-sm text-gray-500 hover:text-gray-700">
            ✕ End Session
          </button>
          <ProgressBar current={session.reviewed} total={session.total} />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {session.currentCard && (
          <>
            <ReviewCard
              card={session.currentCard}
              showBack={session.phase !== 'front'}
              onReveal={session.reveal}
            />
            {session.phase === 'back' && <RatingButtons onRate={session.rate} />}
            {session.phase === 'confidence' && <ConfidenceRating onSelect={session.submitConfidence} />}
          </>
        )}
      </div>
    </div>
  );
}
