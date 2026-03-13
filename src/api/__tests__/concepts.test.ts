import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { conceptsApi } from '../concepts';
import { mockConcepts } from '../../test/mocks/data';

describe('conceptsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('list calls GET /api/concepts with topicId param', async () => {
    let capturedTopicId = '';
    server.use(
      http.get('/api/concepts', ({ request }) => {
        const url = new URL(request.url);
        capturedTopicId = url.searchParams.get('topicId') ?? '';
        return HttpResponse.json(mockConcepts);
      }),
    );

    const res = await conceptsApi.list('topic-1');
    expect(capturedTopicId).toBe('topic-1');
    expect(res.data).toEqual(mockConcepts);
  });

  it('get calls GET /api/concepts/:id', async () => {
    const res = await conceptsApi.get('concept-1');
    expect(res.data).toEqual(mockConcepts[0]);
  });

  it('create calls POST /api/concepts with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/concepts', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ id: 'concept-new', ...capturedBody }, { status: 201 });
      }),
    );

    const data = { topicId: 'topic-1', title: 'Event Loop' };
    await conceptsApi.create(data);
    expect(capturedBody).toEqual(data);
  });

  it('update calls PUT /api/concepts/:id with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    let capturedId = '';
    server.use(
      http.put('/api/concepts/:id', async ({ params, request }) => {
        capturedId = params.id as string;
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ ...mockConcepts[0], ...capturedBody });
      }),
    );

    const data = { title: 'Updated Closures', notes: 'Updated notes' };
    await conceptsApi.update('concept-1', data);
    expect(capturedId).toBe('concept-1');
    expect(capturedBody).toEqual(data);
  });

  it('reorder calls PUT /api/concepts/reorder with orderedIds and topicId', async () => {
    let capturedBody: { orderedIds: string[] } | null = null;
    let capturedTopicId = '';
    server.use(
      http.put('/api/concepts/reorder', async ({ request }) => {
        const url = new URL(request.url);
        capturedTopicId = url.searchParams.get('topicId') ?? '';
        capturedBody = await request.json() as { orderedIds: string[] };
        const reversed = [...mockConcepts].reverse().map((c, i) => ({ ...c, sortOrder: i + 1 }));
        return HttpResponse.json(reversed);
      }),
    );

    const res = await conceptsApi.reorder('topic-1', ['concept-2', 'concept-1']);
    expect(capturedTopicId).toBe('topic-1');
    expect(capturedBody).toEqual({ orderedIds: ['concept-2', 'concept-1'] });
    expect(res.data[0].id).toBe('concept-2');
    expect(res.data[1].id).toBe('concept-1');
  });

  it('delete calls DELETE /api/concepts/:id', async () => {
    let capturedId = '';
    server.use(
      http.delete('/api/concepts/:id', ({ params }) => {
        capturedId = params.id as string;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await conceptsApi.delete('concept-1');
    expect(capturedId).toBe('concept-1');
  });
});
