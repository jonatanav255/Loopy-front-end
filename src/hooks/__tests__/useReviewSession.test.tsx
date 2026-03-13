import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useReviewSession } from '../useReviewSession';
import { mockCards, mockReviewResponse } from '../../test/mocks/data';

describe('useReviewSession', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('initial state is idle with empty cards', () => {
    const { result } = renderHook(() => useReviewSession());
    expect(result.current.phase).toBe('idle');
    expect(result.current.cards).toEqual([]);
    expect(result.current.currentCard).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.reviewed).toBe(0);
  });

  it('loadCards fetches due cards and sets phase to front', async () => {
    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    expect(result.current.phase).toBe('front');
    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.currentCard).toEqual(mockCards[0]);
    expect(result.current.total).toBe(2);
    expect(result.current.reviewed).toBe(0);
  });

  it('loadCards with empty response sets phase to done', async () => {
    server.use(
      http.get('/api/reviews/today', () => {
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    expect(result.current.phase).toBe('done');
    expect(result.current.cards).toEqual([]);
  });

  it('reveal transitions from front to back phase', async () => {
    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    act(() => {
      result.current.reveal();
    });

    expect(result.current.phase).toBe('back');
  });

  it('rate transitions from back to confidence phase', async () => {
    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    act(() => {
      result.current.reveal();
    });

    act(() => {
      result.current.rate(4);
    });

    expect(result.current.phase).toBe('confidence');
    expect(result.current.currentRating).toBe(4);
  });

  it('submitConfidence advances to next card', async () => {
    server.use(
      http.post('/api/reviews/:cardId', () => {
        return HttpResponse.json(mockReviewResponse);
      }),
    );

    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    act(() => result.current.reveal());
    act(() => result.current.rate(4));

    await act(async () => {
      await result.current.submitConfidence(2);
    });

    // Should advance to next card (index 1)
    expect(result.current.phase).toBe('front');
    expect(result.current.currentCard).toEqual(mockCards[1]);
    expect(result.current.reviewed).toBe(1);
    expect(result.current.results).toHaveLength(1);
  });

  it('session completion shows summary after last card', async () => {
    // Only one card
    server.use(
      http.get('/api/reviews/today', () => {
        return HttpResponse.json([mockCards[0]]);
      }),
      http.post('/api/reviews/:cardId', () => {
        return HttpResponse.json(mockReviewResponse);
      }),
    );

    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    act(() => result.current.reveal());
    act(() => result.current.rate(4));

    await act(async () => {
      await result.current.submitConfidence(2);
    });

    expect(result.current.phase).toBe('done');
    expect(result.current.results).toHaveLength(1);
  });

  it('reset returns to idle', async () => {
    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.loadCards();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.cards).toEqual([]);
  });

  it('startPractice fetches practice cards and sets practiceMode', async () => {
    const { result } = renderHook(() => useReviewSession());

    await act(async () => {
      await result.current.startPractice();
    });

    expect(result.current.phase).toBe('front');
    expect(result.current.practiceMode).toBe(true);
    expect(result.current.cards).toEqual(mockCards);
  });
});
