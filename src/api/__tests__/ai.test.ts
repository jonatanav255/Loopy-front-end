import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { aiApi } from '../ai';

describe('aiApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('status calls GET /api/ai/status', async () => {
    const res = await aiApi.status();
    expect(res.data).toEqual({ available: true });
  });

  it('status returns unavailable when AI is down', async () => {
    server.use(
      http.get('/api/ai/status', () => {
        return HttpResponse.json({ available: false });
      }),
    );

    const res = await aiApi.status();
    expect(res.data.available).toBe(false);
  });

  it('generateCards calls POST /api/ai/generate-cards with data', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/ai/generate-cards', async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json([
          { front: 'AI question', back: 'AI answer', cardType: 'STANDARD', hint: null },
        ]);
      }),
    );

    const data = {
      conceptId: 'concept-1',
      content: 'Closures in JavaScript',
      numCards: 3,
    };
    const res = await aiApi.generateCards(data);
    expect(capturedBody).toEqual(data);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].front).toBe('AI question');
    expect(res.data[0].back).toBe('AI answer');
  });

  it('evaluateTeachBack calls POST /api/ai/evaluate-teach-back with data', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/ai/evaluate-teach-back', async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({
          clarityScore: 4,
          accuracyScore: 3,
          completenessScore: 4,
          feedback: 'Good explanation',
          followUpQuestions: ['What about edge cases?'],
          detectedGaps: ['Missing error handling'],
          suggestedCards: [],
        });
      }),
    );

    const data = {
      conceptId: 'concept-1',
      userExplanation: 'A closure captures variables from outer scope',
    };
    const res = await aiApi.evaluateTeachBack(data);
    expect(capturedBody).toEqual(data);
    expect(res.data.clarityScore).toBe(4);
    expect(res.data.accuracyScore).toBe(3);
    expect(res.data.completenessScore).toBe(4);
    expect(res.data.feedback).toBe('Good explanation');
    expect(res.data.followUpQuestions).toEqual(['What about edge cases?']);
    expect(res.data.detectedGaps).toEqual(['Missing error handling']);
    expect(res.data.suggestedCards).toEqual([]);
  });

  it('generateCards handles server error', async () => {
    server.use(
      http.post('/api/ai/generate-cards', () => new HttpResponse(null, { status: 500 })),
    );

    const data = { conceptId: 'concept-1', content: 'test', numCards: 1 };
    await expect(aiApi.generateCards(data)).rejects.toThrow();
  });

  it('evaluateTeachBack handles server error', async () => {
    server.use(
      http.post('/api/ai/evaluate-teach-back', () => new HttpResponse(null, { status: 500 })),
    );

    const data = { conceptId: 'concept-1', userExplanation: 'test' };
    await expect(aiApi.evaluateTeachBack(data)).rejects.toThrow();
  });

  it('status handles server error', async () => {
    server.use(
      http.get('/api/ai/status', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(aiApi.status()).rejects.toThrow();
  });
});
