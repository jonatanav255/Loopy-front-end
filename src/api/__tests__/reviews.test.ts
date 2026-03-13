import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { reviewsApi } from '../reviews';
import { mockCards, mockReviewResponse } from '../../test/mocks/data';

describe('reviewsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('getDueToday calls GET /api/reviews/today', async () => {
    const res = await reviewsApi.getDueToday();
    expect(res.data).toEqual(mockCards);
  });

  it('getDueToday passes limit and topicIds params', async () => {
    let capturedLimit = '';
    let capturedTopicIds = '';
    server.use(
      http.get('/api/reviews/today', ({ request }) => {
        const url = new URL(request.url);
        capturedLimit = url.searchParams.get('limit') ?? '';
        capturedTopicIds = url.searchParams.get('topicIds') ?? '';
        return HttpResponse.json(mockCards);
      }),
    );

    await reviewsApi.getDueToday({ limit: 10, topicIds: ['t1', 't2'] });
    expect(capturedLimit).toBe('10');
    expect(capturedTopicIds).toBe('t1,t2');
  });

  it('submit calls POST /api/reviews/:cardId with review data', async () => {
    let capturedId = '';
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/reviews/:cardId', async ({ params, request }) => {
        capturedId = params.cardId as string;
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json(mockReviewResponse);
      }),
    );

    const res = await reviewsApi.submit('card-1', { rating: 4, responseTimeMs: 5000, confidence: 2 });
    expect(capturedId).toBe('card-1');
    expect(capturedBody).toEqual({ rating: 4, responseTimeMs: 5000, confidence: 2 });
    expect(res.data).toEqual(mockReviewResponse);
  });

  it('getPracticeCards calls GET /api/reviews/practice', async () => {
    const res = await reviewsApi.getPracticeCards();
    expect(res.data).toEqual(mockCards);
  });
});
