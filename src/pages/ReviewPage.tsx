// Dependencies: useNavigate, useCallback, useState, useEffect — see DEPENDENCY_GUIDE.md
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewSession } from '../hooks/useReviewSession';
import { useKeyboard } from '../hooks/useKeyboard';
import { topicsApi } from '../api/topics';
import type { TopicResponse } from '../types/topic';
import { ReviewCard } from '../components/review/ReviewCard';
import { RatingButtons } from '../components/review/RatingButtons';
import { ConfidenceRating } from '../components/review/ConfidenceRating';
import { ProgressBar } from '../components/review/ProgressBar';
import { SessionSummary } from '../components/review/SessionSummary';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ReviewPage() {
  const navigate = useNavigate();
  const session = useReviewSession();

  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoadingTopics(true);
    topicsApi.list().then(res => {
      if (cancelled) return;
      setTopics(res.data);
      setSelectedTopicIds(res.data.map(t => t.id));
    }).finally(() => {
      if (!cancelled) setLoadingTopics(false);
    });
    return () => { cancelled = true; };
  }, []);

  const allSelected = topics.length > 0 && selectedTopicIds.length === topics.length;

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(topics.map(t => t.id));
    }
  }, [allSelected, topics]);

  const toggleTopic = useCallback((id: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleStart = useCallback(() => {
    const params: { topicIds?: string[] } = {};
    if (!allSelected) params.topicIds = selectedTopicIds;
    session.loadCards(Object.keys(params).length > 0 ? params : undefined);
  }, [allSelected, selectedTopicIds, session]);

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
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold text-content">Review Session</h2>
        <p className="mt-2 text-content-tertiary">Configure your review session.</p>

        <div className="mt-6 w-full max-w-md rounded-lg border border-line bg-surface p-6">
          {/* Topic Selection */}
          <div>
            <label className="text-sm font-medium text-content-secondary">Topics</label>

            {loadingTopics ? (
              <p className="mt-2 text-sm text-content-tertiary">Loading topics...</p>
            ) : topics.length === 0 ? (
              <p className="mt-2 text-sm text-content-tertiary">No topics found. Create a topic first.</p>
            ) : (
              <>
                <label className="mt-2 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-content">All Topics</span>
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {topics.map(topic => (
                    <label key={topic.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTopicIds.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="accent-indigo-600"
                      />
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: topic.colorHex }}
                      />
                      <span className="text-sm text-content truncate">{topic.name}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={selectedTopicIds.length === 0}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Review
          </button>
        </div>
      </div>
    );
  }

  if (session.phase === 'loading') return <LoadingSpinner className="py-20" />;

  // Done — show summary
  if (session.phase === 'done') {
    if (session.results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold text-content">All caught up!</h2>
          <p className="mt-2 text-content-tertiary">No cards due for review today.</p>
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
    <div className="fixed inset-0 z-40 flex flex-col bg-surface-alt">
      <div className="border-b border-line bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button onClick={session.reset} className="text-sm text-content-muted hover:text-content-secondary">
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
