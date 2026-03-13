import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { cardsApi } from '../cards';
import { mockCards } from '../../test/mocks/data';

describe('cardsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('list calls GET /api/cards with conceptId param', async () => {
    let capturedConceptId = '';
    server.use(
      http.get('/api/cards', ({ request }) => {
        const url = new URL(request.url);
        capturedConceptId = url.searchParams.get('conceptId') ?? '';
        return HttpResponse.json(mockCards);
      }),
    );

    const res = await cardsApi.list('concept-1');
    expect(capturedConceptId).toBe('concept-1');
    expect(res.data).toEqual(mockCards);
  });

  it('get calls GET /api/cards/:id', async () => {
    const res = await cardsApi.get('card-1');
    expect(res.data).toEqual(mockCards[0]);
  });

  it('create calls POST /api/cards with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/cards', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ id: 'card-new', ...capturedBody }, { status: 201 });
      }),
    );

    const data = {
      conceptId: 'concept-1',
      front: 'Q?',
      back: 'A.',
      cardType: 'STANDARD' as const,
    };
    await cardsApi.create(data);
    expect(capturedBody).toEqual(data);
  });

  it('update calls PUT /api/cards/:id with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    let capturedId = '';
    server.use(
      http.put('/api/cards/:id', async ({ params, request }) => {
        capturedId = params.id as string;
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ ...mockCards[0], ...capturedBody });
      }),
    );

    const data = { front: 'Updated Q', back: 'Updated A', cardType: 'STANDARD' as const };
    await cardsApi.update('card-1', data);
    expect(capturedId).toBe('card-1');
    expect(capturedBody).toEqual(data);
  });

  it('delete calls DELETE /api/cards/:id', async () => {
    let capturedId = '';
    server.use(
      http.delete('/api/cards/:id', ({ params }) => {
        capturedId = params.id as string;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await cardsApi.delete('card-1');
    expect(capturedId).toBe('card-1');
  });

  it('switchAlgorithm calls PUT /api/cards/:id/algorithm with algorithm param', async () => {
    let capturedId = '';
    let capturedAlgorithm = '';
    server.use(
      http.put('/api/cards/:id/algorithm', ({ params, request }) => {
        capturedId = params.id as string;
        const url = new URL(request.url);
        capturedAlgorithm = url.searchParams.get('algorithm') ?? '';
        return HttpResponse.json({ ...mockCards[0], schedulingAlgorithm: capturedAlgorithm });
      }),
    );

    const res = await cardsApi.switchAlgorithm('card-1', 'FSRS');
    expect(capturedId).toBe('card-1');
    expect(capturedAlgorithm).toBe('FSRS');
    expect(res.data.schedulingAlgorithm).toBe('FSRS');
  });
});
