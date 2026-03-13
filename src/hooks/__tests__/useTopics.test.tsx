import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useTopics } from '../useTopics';
import { mockTopics } from '../../test/mocks/data';

describe('useTopics', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('fetchTopics populates topics array', async () => {
    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.topics).toEqual(mockTopics);
    expect(result.current.error).toBeNull();
  });

  it('createTopic adds to list', async () => {
    const newTopic = {
      id: 'topic-new',
      name: 'Python',
      description: 'Python lang',
      colorHex: '#EF4444',
      createdAt: '2025-03-13T00:00:00Z',
      updatedAt: '2025-03-13T00:00:00Z',
      cardCount: 0,
    };
    server.use(
      http.post('/api/topics', () => {
        return HttpResponse.json(newTopic, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useTopics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createTopic({ name: 'Python', description: 'Python lang', colorHex: '#EF4444' });
    });

    expect(result.current.topics).toHaveLength(mockTopics.length + 1);
    expect(result.current.topics[result.current.topics.length - 1].name).toBe('Python');
  });

  it('updateTopic modifies existing', async () => {
    const updated = { ...mockTopics[0], name: 'Updated JavaScript' };
    server.use(
      http.put('/api/topics/:id', () => {
        return HttpResponse.json(updated);
      }),
    );

    const { result } = renderHook(() => useTopics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateTopic('topic-1', { name: 'Updated JavaScript' });
    });

    const found = result.current.topics.find(t => t.id === 'topic-1');
    expect(found?.name).toBe('Updated JavaScript');
  });

  it('deleteTopic removes from list', async () => {
    const { result } = renderHook(() => useTopics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialLength = result.current.topics.length;
    await act(async () => {
      await result.current.deleteTopic('topic-1');
    });

    expect(result.current.topics).toHaveLength(initialLength - 1);
    expect(result.current.topics.find(t => t.id === 'topic-1')).toBeUndefined();
  });

  it('reorderTopics updates order optimistically', async () => {
    const reversedTopics = [...mockTopics].reverse().map((t, i) => ({ ...t, sortOrder: i + 1 }));
    server.use(
      http.put('/api/topics/reorder', () => {
        return HttpResponse.json(reversedTopics);
      }),
    );

    const { result } = renderHook(() => useTopics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const reversedIds = mockTopics.map(t => t.id).reverse();
    await act(async () => {
      await result.current.reorderTopics(reversedIds);
    });

    expect(result.current.topics[0].id).toBe('topic-2');
    expect(result.current.topics[1].id).toBe('topic-1');
  });

  it('sets loading during fetch and error on failure', async () => {
    server.use(
      http.get('/api/topics', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useTopics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load topics');
  });
});
