import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useDataport } from '../useDataport';

describe('useDataport', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts with no loading and no error', () => {
    const { result } = renderHook(() => useDataport());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exportData returns export data', async () => {
    const { result } = renderHook(() => useDataport());

    let exportResult: Awaited<ReturnType<typeof result.current.exportData>> | null = null;
    await act(async () => {
      exportResult = await result.current.exportData();
    });

    expect(exportResult).not.toBeNull();
    expect(exportResult!.exportVersion).toBe('1.0');
    expect(exportResult!.topics.length).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exportData passes topicIds filter', async () => {
    let capturedTopicIds = '';
    server.use(
      http.get('/api/dataport/export', ({ request }) => {
        const url = new URL(request.url);
        capturedTopicIds = url.searchParams.get('topicIds') ?? '';
        return HttpResponse.json({
          exportVersion: '1.0',
          exportedAt: new Date().toISOString(),
          topicCount: 1,
          conceptCount: 0,
          cardCount: 0,
          topics: [],
        });
      }),
    );

    const { result } = renderHook(() => useDataport());

    await act(async () => {
      await result.current.exportData(['topic-1']);
    });

    expect(capturedTopicIds).toBe('topic-1');
  });

  it('exportData sets error on failure', async () => {
    server.use(
      http.get('/api/dataport/export', () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useDataport());

    await act(async () => {
      try {
        await result.current.exportData();
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Export failed');
  });

  it('importData returns import summary', async () => {
    const { result } = renderHook(() => useDataport());

    const importPayload = {
      exportVersion: '1.0',
      topics: [
        {
          name: 'Python',
          concepts: [
            {
              title: 'Decorators',
              cards: [
                { front: 'What is a decorator?', back: 'A wrapper' },
              ],
            },
          ],
        },
      ],
    };

    let importResult: Awaited<ReturnType<typeof result.current.importData>> | null = null;
    await act(async () => {
      importResult = await result.current.importData(importPayload);
    });

    expect(importResult).not.toBeNull();
    expect(importResult!.topicsCreated).toBe(1);
    expect(importResult!.conceptsCreated).toBe(1);
    expect(importResult!.cardsCreated).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('importData sets error on failure', async () => {
    server.use(
      http.post('/api/dataport/import', () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useDataport());

    await act(async () => {
      try {
        await result.current.importData({ exportVersion: '1.0', topics: [] });
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Import failed');
  });

  it('loading resets to false after export completes', async () => {
    const { result } = renderHook(() => useDataport());

    await act(async () => {
      await result.current.exportData();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
