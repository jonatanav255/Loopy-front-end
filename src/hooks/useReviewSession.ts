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
}

export function useReviewSession() {
  const [state, setState] = useState<SessionState>({
    phase: 'idle',
    cards: [],
    currentIndex: 0,
    currentRating: null,
    results: [],
    startTime: 0,
  });

  const loadCards = useCallback(async () => {
    setState(prev => ({ ...prev, phase: 'loading' }));
    try {
      const res = await reviewsApi.getDueToday();
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
    const { cards, currentIndex, currentRating, results, startTime } = state;
    if (state.phase !== 'confidence' || currentRating === null) return;

    const card = cards[currentIndex];
    const responseTimeMs = Date.now() - startTime;

    const res = await reviewsApi.submit(card.id, { rating: currentRating, responseTimeMs, confidence });
    const newResults = [...results, res.data];

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

  const reset = useCallback(() => {
    setState({ phase: 'idle', cards: [], currentIndex: 0, currentRating: null, results: [], startTime: 0 });
  }, []);

  const currentCard = state.cards[state.currentIndex] ?? null;
  const total = state.cards.length;
  const reviewed = state.currentIndex;

  return { ...state, currentCard, total, reviewed, loadCards, reveal, rate, submitConfidence, reset };
}
