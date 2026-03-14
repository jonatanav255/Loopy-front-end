import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { teachBackApi } from '../teachback';
import { mockConcepts } from '../../test/mocks/data';

describe('teachBackApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('getPending calls GET /api/teach-back/pending', async () => {
    const res = await teachBackApi.getPending();
    expect(res.data).toEqual(mockConcepts);
  });

  it('submit calls POST /api/teach-back with data', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/teach-back', async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({
          id: 'tb-1',
          conceptId: capturedBody.conceptId,
          conceptTitle: 'Closures',
          userExplanation: capturedBody.userExplanation,
          referenceExplanation: null,
          selfRating: capturedBody.selfRating,
          gapsFound: [],
          createdAt: new Date().toISOString(),
        });
      }),
    );

    const data = {
      conceptId: 'concept-1',
      userExplanation: 'My explanation of closures',
      selfRating: 4,
    };
    const res = await teachBackApi.submit(data);
    expect(capturedBody).toEqual(data);
    expect(res.data.id).toBe('tb-1');
    expect(res.data.conceptId).toBe('concept-1');
    expect(res.data.userExplanation).toBe('My explanation of closures');
  });

  it('submit includes optional gapsFound', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/teach-back', async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({
          id: 'tb-2',
          conceptId: 'concept-1',
          conceptTitle: 'Closures',
          userExplanation: 'explanation',
          referenceExplanation: null,
          selfRating: 3,
          gapsFound: capturedBody.gapsFound,
          createdAt: new Date().toISOString(),
        });
      }),
    );

    const data = {
      conceptId: 'concept-1',
      userExplanation: 'explanation',
      selfRating: 3,
      gapsFound: ['memory leaks', 'scope chain'],
    };
    const res = await teachBackApi.submit(data);
    expect(capturedBody?.gapsFound).toEqual(['memory leaks', 'scope chain']);
    expect(res.data.gapsFound).toEqual(['memory leaks', 'scope chain']);
  });

  it('getHistory calls GET /api/teach-back/history with conceptId param', async () => {
    let capturedConceptId = '';
    server.use(
      http.get('/api/teach-back/history', ({ request }) => {
        const url = new URL(request.url);
        capturedConceptId = url.searchParams.get('conceptId') ?? '';
        return HttpResponse.json([]);
      }),
    );

    const res = await teachBackApi.getHistory('concept-1');
    expect(capturedConceptId).toBe('concept-1');
    expect(res.data).toEqual([]);
  });

  it('getPending handles server error', async () => {
    server.use(
      http.get('/api/teach-back/pending', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(teachBackApi.getPending()).rejects.toThrow();
  });

  it('submit handles server error', async () => {
    server.use(
      http.post('/api/teach-back', () => new HttpResponse(null, { status: 500 })),
    );

    const data = {
      conceptId: 'concept-1',
      userExplanation: 'explanation',
      selfRating: 3,
    };
    await expect(teachBackApi.submit(data)).rejects.toThrow();
  });
});
