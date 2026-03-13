import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useStats } from '../useStats';
import { mockStatsOverview, mockAccuracy, mockHeatmap, mockFragileCards } from '../../test/mocks/data';

describe('useStats', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('fetches overview, accuracy, heatmap, and fragile in parallel', async () => {
    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.overview).toEqual(mockStatsOverview);
    expect(result.current.accuracy).toEqual(mockAccuracy);
    expect(result.current.heatmap).toEqual(mockHeatmap);
    expect(result.current.fragile).toEqual(mockFragileCards);
  });

  it('handles partial failure gracefully', async () => {
    server.use(
      http.get('/api/stats/overview', () => {
        return HttpResponse.json(mockStatsOverview);
      }),
      http.get('/api/stats/accuracy', () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get('/api/stats/heatmap', () => {
        return HttpResponse.json(mockHeatmap);
      }),
      http.get('/api/stats/fragile', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Successful endpoints should have data
    expect(result.current.overview).toEqual(mockStatsOverview);
    expect(result.current.heatmap).toEqual(mockHeatmap);
    // Failed endpoints should have default values
    expect(result.current.accuracy).toEqual([]);
    expect(result.current.fragile).toEqual([]);
  });

  it('handles all failures gracefully', async () => {
    server.use(
      http.get('/api/stats/overview', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/accuracy', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/heatmap', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/fragile', () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.overview).toBeNull();
    expect(result.current.accuracy).toEqual([]);
    expect(result.current.heatmap).toEqual([]);
    expect(result.current.fragile).toEqual([]);
  });
});
