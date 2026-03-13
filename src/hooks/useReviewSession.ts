// Dependencies: useState, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useCallback } from 'react';
import { reviewsApi } from '../api/reviews';
import type { CardResponse } from '../types/card';
import type { ReviewResponse } from '../types/review';

type Phase = 'loading' | 'idle' | 'front' | 'back' | 'confidence' | 'done';

interface SessionState {
  phase: Phase;
  cards: CardResponse[];
  currentIndex: number;
  currentRating: number | null;
  results: ReviewResponse[];
  startTime: number;
  practiceMode: boolean;
}

export function useReviewSession() {
  const [state, setState] = useState<SessionState>({
    phase: 'idle',
    cards: [],
    currentIndex: 0,
    currentRating: null,
    results: [],
    startTime: 0,
    practiceMode: false,
  });

  const loadCards = useCallback(async (params?: { limit?: number; topicIds?: string[] }) => {
    setState(prev => ({ ...prev, phase: 'loading' }));
    try {
      const res = await reviewsApi.getDueToday(params);
      const cards = res.data;
      if (cards.length === 0) {
        setState(prev => ({ ...prev, phase: 'done', cards: [], results: [] }));
      } else {
        setState({
          phase: 'front',
          cards,
          currentIndex: 0,
          currentRating: null,
          results: [],
          startTime: Date.now(),
          practiceMode: false,
        });
      }
    } catch {
      setState(prev => ({ ...prev, phase: 'idle' }));
    }
  }, []);

  const reveal = useCallback(() => {
    setState(prev => prev.phase === 'front' ? { ...prev, phase: 'back' } : prev);
  }, []);

  const rate = useCallback((rating: number) => {
    setState(prev => prev.phase === 'back' ? { ...prev, phase: 'confidence', currentRating: rating } : prev);
  }, []);

  const submitConfidence = useCallback(async (confidence: number) => {
    const { cards, currentIndex, currentRating, results, startTime, practiceMode } = state;
    if (state.phase !== 'confidence' || currentRating === null) return;

    let newResults: ReviewResponse[];
    if (practiceMode) {
      // Practice mode: no API call, build a local-only result for the summary
      const card = cards[currentIndex];
      const fakeResult: ReviewResponse = {
        reviewLogId: `practice-${currentIndex}`,
        rating: currentRating,
        confidence,
        responseTimeMs: Date.now() - startTime,
        reviewedAt: new Date().toISOString(),
        updatedCard: card,
      };
      newResults = [...results, fakeResult];
    } else {
      const card = cards[currentIndex];
      const responseTimeMs = Date.now() - startTime;
      const res = await reviewsApi.submit(card.id, { rating: currentRating, responseTimeMs, confidence });
      newResults = [...results, res.data];
    }

    if (currentIndex + 1 >= cards.length) {
      setState(prev => ({ ...prev, phase: 'done', results: newResults }));
    } else {
      setState(prev => ({
        ...prev,
        phase: 'front',
        currentIndex: prev.currentIndex + 1,
        currentRating: null,
        results: newResults,
        startTime: Date.now(),
      }));
    }
  }, [state]);

  const startPractice = useCallback(async (params?: { topicIds?: string[] }) => {
    setState(prev => ({ ...prev, phase: 'loading' }));
    try {
      const res = await reviewsApi.getPracticeCards(params);
      const cards = res.data;
      if (cards.length === 0) {
        setState(prev => ({ ...prev, phase: 'done', cards: [], results: [] }));
      } else {
        setState({
          phase: 'front',
          cards,
          currentIndex: 0,
          currentRating: null,
          results: [],
          startTime: Date.now(),
          practiceMode: true,
        });
      }
    } catch {
      setState(prev => ({ ...prev, phase: 'idle' }));
    }
  }, []);

  const practiceAgain = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'front',
      currentIndex: 0,
      currentRating: null,
      results: [],
      startTime: Date.now(),
      practiceMode: true,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ phase: 'idle', cards: [], currentIndex: 0, currentRating: null, results: [], startTime: 0, practiceMode: false });
  }, []);

  const currentCard = state.cards[state.currentIndex] ?? null;
  const total = state.cards.length;
  const reviewed = state.currentIndex;

  return { ...state, currentCard, total, reviewed, loadCards, startPractice, reveal, rate, submitConfidence, practiceAgain, reset };
}
