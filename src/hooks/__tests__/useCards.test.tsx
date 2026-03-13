import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useCards } from '../useCards';
import { mockCards } from '../../test/mocks/data';

describe('useCards', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('fetchCards populates cards array', async () => {
    const { result } = renderHook(() => useCards('concept-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.error).toBeNull();
  });

  it('does not fetch when conceptId is undefined', async () => {
    const { result } = renderHook(() => useCards(undefined));
    await new Promise(r => setTimeout(r, 50));
    expect(result.current.cards).toEqual([]);
  });

  it('createCard adds to list', async () => {
    const newCard = { ...mockCards[0], id: 'card-new', front: 'New Q', back: 'New A' };
    server.use(
      http.post('/api/cards', () => {
        return HttpResponse.json(newCard, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useCards('concept-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createCard({
        conceptId: 'concept-1',
        front: 'New Q',
        back: 'New A',
        cardType: 'STANDARD',
      });
    });

    expect(result.current.cards).toHaveLength(mockCards.length + 1);
  });

  it('updateCard modifies existing', async () => {
    const updated = { ...mockCards[0], front: 'Updated Q' };
    server.use(
      http.put('/api/cards/:id', () => {
        return HttpResponse.json(updated);
      }),
    );

    const { result } = renderHook(() => useCards('concept-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateCard('card-1', { front: 'Updated Q', back: 'A', cardType: 'STANDARD' });
    });

    const found = result.current.cards.find(c => c.id === 'card-1');
    expect(found?.front).toBe('Updated Q');
  });

  it('deleteCard removes from list', async () => {
    const { result } = renderHook(() => useCards('concept-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialLength = result.current.cards.length;
    await act(async () => {
      await result.current.deleteCard('card-1');
    });

    expect(result.current.cards).toHaveLength(initialLength - 1);
  });

  it('switchAlgorithm updates the card algorithm', async () => {
    const updated = { ...mockCards[0], schedulingAlgorithm: 'FSRS' as const };
    server.use(
      http.put('/api/cards/:id/algorithm', () => {
        return HttpResponse.json(updated);
      }),
    );

    const { result } = renderHook(() => useCards('concept-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.switchAlgorithm('card-1', 'FSRS');
    });

    const found = result.current.cards.find(c => c.id === 'card-1');
    expect(found?.schedulingAlgorithm).toBe('FSRS');
  });

  it('sets error on fetch failure', async () => {
    server.use(
      http.get('/api/cards', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCards('concept-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load cards');
  });
});
