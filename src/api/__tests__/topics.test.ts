import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { topicsApi } from '../topics';
import { mockTopics } from '../../test/mocks/data';

describe('topicsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('list calls GET /api/topics', async () => {
    const res = await topicsApi.list();
    expect(res.data).toEqual(mockTopics);
  });

  it('get calls GET /api/topics/:id', async () => {
    const res = await topicsApi.get('topic-1');
    expect(res.data).toEqual(mockTopics[0]);
  });

  it('create calls POST /api/topics with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/topics', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ id: 'topic-new', ...capturedBody }, { status: 201 });
      }),
    );

    const data = { name: 'Python', description: 'Python language', colorHex: '#EF4444' };
    const res = await topicsApi.create(data);
    expect(capturedBody).toEqual(data);
    expect(res.data.name).toBe('Python');
  });

  it('update calls PUT /api/topics/:id with data', async () => {
    let capturedBody: Record<string, string> | null = null;
    let capturedId = '';
    server.use(
      http.put('/api/topics/:id', async ({ params, request }) => {
        capturedId = params.id as string;
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json({ ...mockTopics[0], ...capturedBody });
      }),
    );

    const data = { name: 'Updated JS', description: 'Updated description' };
    await topicsApi.update('topic-1', data);
    expect(capturedId).toBe('topic-1');
    expect(capturedBody).toEqual(data);
  });

  it('delete calls DELETE /api/topics/:id', async () => {
    let capturedId = '';
    server.use(
      http.delete('/api/topics/:id', ({ params }) => {
        capturedId = params.id as string;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await topicsApi.delete('topic-1');
    expect(capturedId).toBe('topic-1');
  });
});
