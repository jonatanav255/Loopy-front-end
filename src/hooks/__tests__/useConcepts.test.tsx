import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useConcepts } from '../useConcepts';
import { mockConcepts } from '../../test/mocks/data';

describe('useConcepts', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('fetchConcepts populates concepts array', async () => {
    const { result } = renderHook(() => useConcepts('topic-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.concepts).toEqual(mockConcepts);
    expect(result.current.error).toBeNull();
  });

  it('does not fetch when topicId is undefined', async () => {
    const { result } = renderHook(() => useConcepts(undefined));

    // Should remain loading since fetchConcepts returns early
    // Give it a moment, then check concepts are empty
    await new Promise(r => setTimeout(r, 50));
    expect(result.current.concepts).toEqual([]);
  });

  it('createConcept adds to list', async () => {
    const newConcept = {
      id: 'concept-new',
      topicId: 'topic-1',
      title: 'Event Loop',
      notes: null,
      referenceExplanation: null,
      status: 'LEARNING' as const,
      createdAt: '2025-03-13T00:00:00Z',
      updatedAt: '2025-03-13T00:00:00Z',
    };
    server.use(
      http.post('/api/concepts', () => {
        return HttpResponse.json(newConcept, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useConcepts('topic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createConcept({ topicId: 'topic-1', title: 'Event Loop' });
    });

    expect(result.current.concepts).toHaveLength(mockConcepts.length + 1);
    expect(result.current.concepts[result.current.concepts.length - 1].title).toBe('Event Loop');
  });

  it('updateConcept modifies existing', async () => {
    const updated = { ...mockConcepts[0], title: 'Updated Closures' };
    server.use(
      http.put('/api/concepts/:id', () => {
        return HttpResponse.json(updated);
      }),
    );

    const { result } = renderHook(() => useConcepts('topic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateConcept('concept-1', { title: 'Updated Closures' });
    });

    const found = result.current.concepts.find(c => c.id === 'concept-1');
    expect(found?.title).toBe('Updated Closures');
  });

  it('deleteConcept removes from list', async () => {
    const { result } = renderHook(() => useConcepts('topic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialLength = result.current.concepts.length;
    await act(async () => {
      await result.current.deleteConcept('concept-1');
    });

    expect(result.current.concepts).toHaveLength(initialLength - 1);
  });

  it('reorderConcepts updates order optimistically', async () => {
    const reversedConcepts = [...mockConcepts].reverse().map((c, i) => ({ ...c, sortOrder: i + 1 }));
    server.use(
      http.put('/api/concepts/reorder', () => {
        return HttpResponse.json(reversedConcepts);
      }),
    );

    const { result } = renderHook(() => useConcepts('topic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const reversedIds = mockConcepts.map(c => c.id).reverse();
    await act(async () => {
      await result.current.reorderConcepts(reversedIds);
    });

    expect(result.current.concepts[0].id).toBe('concept-2');
    expect(result.current.concepts[1].id).toBe('concept-1');
  });

  it('sets error on fetch failure', async () => {
    server.use(
      http.get('/api/concepts', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useConcepts('topic-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load concepts');
  });
});
