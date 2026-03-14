import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { dataportApi } from '../dataport';

describe('dataportApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('export calls GET /api/dataport/export', async () => {
    const res = await dataportApi.export();
    expect(res.data.exportVersion).toBe('1.0');
    expect(res.data.topics).toBeDefined();
    expect(res.data.topics.length).toBeGreaterThan(0);
  });

  it('export includes topic, concept, and card counts', async () => {
    const res = await dataportApi.export();
    expect(res.data.topicCount).toBeGreaterThan(0);
    expect(res.data.conceptCount).toBeGreaterThan(0);
    expect(res.data.cardCount).toBeGreaterThan(0);
  });

  it('export passes topicIds as query param', async () => {
    let capturedTopicIds = '';
    server.use(
      http.get('/api/dataport/export', ({ request }) => {
        const url = new URL(request.url);
        capturedTopicIds = url.searchParams.get('topicIds') ?? '';
        return HttpResponse.json({
          exportVersion: '1.0',
          exportedAt: new Date().toISOString(),
          topicCount: 1,
          conceptCount: 1,
          cardCount: 1,
          topics: [],
        });
      }),
    );

    await dataportApi.export(['topic-1', 'topic-2']);
    expect(capturedTopicIds).toBe('topic-1,topic-2');
  });

  it('export without topicIds does not send topicIds param', async () => {
    let hasTopicIds = false;
    server.use(
      http.get('/api/dataport/export', ({ request }) => {
        const url = new URL(request.url);
        hasTopicIds = url.searchParams.has('topicIds');
        return HttpResponse.json({
          exportVersion: '1.0',
          exportedAt: new Date().toISOString(),
          topicCount: 0,
          conceptCount: 0,
          cardCount: 0,
          topics: [],
        });
      }),
    );

    await dataportApi.export();
    expect(hasTopicIds).toBe(false);
  });

  it('import calls POST /api/dataport/import with data', async () => {
    let capturedBody: Record<string, unknown> | null = null;
    server.use(
      http.post('/api/dataport/import', async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ topicsCreated: 1, conceptsCreated: 2, cardsCreated: 3 }, { status: 201 });
      }),
    );

    const data = {
      exportVersion: '1.0',
      topics: [
        {
          name: 'Python',
          description: 'Python programming',
          concepts: [
            {
              title: 'Decorators',
              cards: [
                { front: 'What is a decorator?', back: 'A function wrapper', cardType: 'STANDARD' },
                { front: 'How to apply?', back: 'Use @syntax', cardType: 'STANDARD' },
              ],
            },
            {
              title: 'Generators',
              cards: [
                { front: 'What is yield?', back: 'Pauses generator', cardType: 'STANDARD' },
              ],
            },
          ],
        },
      ],
    };
    const res = await dataportApi.import(data);
    expect(capturedBody).toEqual(data);
    expect(res.data.topicsCreated).toBe(1);
    expect(res.data.conceptsCreated).toBe(2);
    expect(res.data.cardsCreated).toBe(3);
  });

  it('import handles server error', async () => {
    server.use(
      http.post('/api/dataport/import', () => new HttpResponse(null, { status: 500 })),
    );

    const data = { exportVersion: '1.0', topics: [] };
    await expect(dataportApi.import(data)).rejects.toThrow();
  });

  it('export handles server error', async () => {
    server.use(
      http.get('/api/dataport/export', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(dataportApi.export()).rejects.toThrow();
  });
});
