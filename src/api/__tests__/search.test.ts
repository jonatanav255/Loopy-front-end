import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { searchApi } from '../search';

describe('searchApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('search calls GET /api/search with q param', async () => {
    let capturedQuery = '';
    server.use(
      http.get('/api/search', ({ request }) => {
        const url = new URL(request.url);
        capturedQuery = url.searchParams.get('q') ?? '';
        return HttpResponse.json({ topics: [], concepts: [], cards: [] });
      }),
    );

    await searchApi.search('javascript');
    expect(capturedQuery).toBe('javascript');
  });

  it('search returns matching results', async () => {
    const res = await searchApi.search('javascript');
    expect(res.data.topics).toHaveLength(1);
    expect(res.data.topics[0].name).toBe('JavaScript');
  });

  it('search with empty query returns empty results', async () => {
    const res = await searchApi.search('');
    expect(res.data.topics).toEqual([]);
    expect(res.data.concepts).toEqual([]);
    expect(res.data.cards).toEqual([]);
  });

  it('search with non-matching query returns empty results', async () => {
    const res = await searchApi.search('zzzznotfound');
    expect(res.data.topics).toEqual([]);
    expect(res.data.concepts).toEqual([]);
    expect(res.data.cards).toEqual([]);
  });

  it('search finds concepts by title', async () => {
    const res = await searchApi.search('closures');
    expect(res.data.concepts.length).toBeGreaterThanOrEqual(1);
    expect(res.data.concepts[0].title).toBe('Closures');
  });

  it('search finds cards by front text', async () => {
    const res = await searchApi.search('closure');
    expect(res.data.cards.length).toBeGreaterThanOrEqual(1);
    expect(res.data.cards[0].front).toContain('closure');
  });

  it('search handles server error', async () => {
    server.use(
      http.get('/api/search', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(searchApi.search('test')).rejects.toThrow();
  });
});
