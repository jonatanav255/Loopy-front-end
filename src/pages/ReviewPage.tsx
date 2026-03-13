// Dependencies: useNavigate, useCallback, useState, useEffect — see DEPENDENCY_GUIDE.md
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewSession } from '../hooks/useReviewSession';
import { useKeyboard } from '../hooks/useKeyboard';
import { useI18n } from '../contexts/I18nContext';
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
  const { t } = useI18n();

  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoadingTopics(true);
    topicsApi.list().then(res => {
      if (cancelled) return;
      const withCards = res.data.filter(t => t.cardCount > 0);
      setTopics(withCards);
      setSelectedTopicIds(withCards.map(t => t.id));
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
    if (key === 'Escape' && (session.phase === 'front' || session.phase === 'back' || session.phase === 'confidence')) {
      session.reset();
    } else if (session.phase === 'front' && key === ' ') {
      session.reveal();
    } else if (session.phase === 'back') {
      const num = parseInt(key);
      if (num >= 1 && num <= 6) session.rate(num - 1);
    } else if (session.phase === 'confidence') {
      const num = parseInt(key);
      if (num >= 1 && num <= 3) session.submitConfidence(num);
    } else if (session.phase === 'idle') {
      if (key === 'Enter') {
        if (selectedTopicIds.length > 0) handleStart();
      } else if (key === 'a' || key === 'A') {
        toggleAll();
      } else {
        const num = parseInt(key);
        if (num >= 1 && num <= topics.length) {
          toggleTopic(topics[num - 1].id);
        }
      }
    } else if (session.phase === 'done') {
      if (key === 'Enter') navigate('/');
      if ((key === 'p' || key === 'P') && session.results.length === 0) session.startPractice();
      if ((key === 'p' || key === 'P') && session.results.length > 0) session.practiceAgain();
    }
  }, [session, selectedTopicIds, topics, handleStart, toggleAll, toggleTopic, navigate]);

  useKeyboard(handleKeyboard);

  // Idle — show launcher
  if (session.phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-3 text-2xl font-semibold text-content">{t.review.title}</h2>
        <p className="text-content-tertiary">{t.review.configure}</p>

        <div className="mt-6 w-full max-w-md rounded-lg border border-line bg-surface p-6">
          <div>
            <label className="text-sm font-medium text-content-secondary">{t.review.topicsLabel}</label>

            {loadingTopics ? (
              <p className="mt-2 text-sm text-content-tertiary">{t.review.loadingTopics}</p>
            ) : topics.length === 0 ? (
              <p className="mt-2 text-sm text-content-tertiary">{t.review.noTopicsFound}</p>
            ) : (
              <>
                <label className="mt-2 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-primary"
                  />
                  <span className="text-sm text-content">{t.review.allTopics}</span>
                  <span className="text-xs opacity-60">(A)</span>
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {topics.map((topic, idx) => (
                    <label key={topic.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTopicIds.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="accent-primary"
                      />
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: topic.colorHex }}
                      />
                      <span className="text-sm text-content truncate">{topic.name}</span>
                      {idx < 9 && <span className="text-xs opacity-60">({idx + 1})</span>}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={selectedTopicIds.length === 0}
            className="mt-6 w-full rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.review.startReview} <span className="ml-1 text-xs opacity-60">(Enter)</span>
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
          <h2 className="text-2xl font-semibold text-content">{t.review.allCaughtUp}</h2>
          <p className="mt-2 text-content-tertiary">{t.review.noCardsDue}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => session.startPractice()} className="rounded-lg border border-primary px-6 py-3 text-sm font-medium text-primary-text hover:bg-primary-subtle">
              {t.review.practiceAll} <span className="ml-1 text-xs opacity-60">(P)</span>
            </button>
            <button onClick={() => navigate('/')} className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              {t.review.backToDashboard} <span className="ml-1 text-xs opacity-60">(Enter)</span>
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="py-20">
        <SessionSummary results={session.results} onDone={() => navigate('/')} onPracticeAgain={session.practiceAgain} />
      </div>
    );
  }

  // Active session — full-screen overlay
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-surface-alt">
      <div className="border-b border-line bg-surface px-6 py-5">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={session.reset} className="flex h-8 w-8 items-center justify-center rounded-full border border-content-muted text-content hover:bg-surface-hover" title="End Session (Esc)">
              ✕
            </button>
            <span className="text-sm text-content">{t.review.endSession} <span className="text-xs text-content-muted">(Esc)</span></span>
          </div>
          {session.practiceMode && <span className="text-xs text-yellow-400">{t.review.practiceMode}</span>}
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
