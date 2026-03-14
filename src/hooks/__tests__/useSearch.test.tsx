import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useSearch } from '../useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts with empty results and no loading', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.results).toEqual({ topics: [], concepts: [], cards: [] });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.query).toBe('');
    expect(result.current.totalResults).toBe(0);
  });

  it('search updates results with matching data', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('javascript');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.query).toBe('javascript');
    expect(result.current.results.topics).toHaveLength(1);
    expect(result.current.results.topics[0].name).toBe('JavaScript');
    expect(result.current.totalResults).toBeGreaterThan(0);
  });

  it('search with empty string returns empty results without loading', async () => {
    const { result } = renderHook(() => useSearch());

    // First do a real search
    await act(async () => {
      await result.current.search('javascript');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.results.topics.length).toBeGreaterThan(0);

    // Now search with empty string
    await act(async () => {
      await result.current.search('');
    });

    expect(result.current.results).toEqual({ topics: [], concepts: [], cards: [] });
    expect(result.current.loading).toBe(false);
    expect(result.current.totalResults).toBe(0);
  });

  it('search with whitespace-only string returns empty results', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(result.current.results).toEqual({ topics: [], concepts: [], cards: [] });
    expect(result.current.loading).toBe(false);
  });

  it('clear resets all state', async () => {
    const { result } = renderHook(() => useSearch());

    // Do a search first
    await act(async () => {
      await result.current.search('javascript');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.query).toBe('javascript');
    expect(result.current.totalResults).toBeGreaterThan(0);

    // Now clear
    act(() => {
      result.current.clear();
    });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual({ topics: [], concepts: [], cards: [] });
    expect(result.current.error).toBeNull();
    expect(result.current.totalResults).toBe(0);
  });

  it('sets error on server failure', async () => {
    server.use(
      http.get('/api/search', () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Search failed');
  });

  it('totalResults sums topics, concepts, and cards', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('closure');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const expected =
      result.current.results.topics.length +
      result.current.results.concepts.length +
      result.current.results.cards.length;
    expect(result.current.totalResults).toBe(expected);
  });
});
