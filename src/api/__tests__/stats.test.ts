import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { statsApi } from '../stats';
import { mockStatsOverview, mockAccuracy, mockHeatmap, mockFragileCards } from '../../test/mocks/data';

describe('statsApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('overview calls GET /api/stats/overview', async () => {
    const res = await statsApi.overview();
    expect(res.data).toEqual(mockStatsOverview);
  });

  it('accuracy calls GET /api/stats/accuracy', async () => {
    const res = await statsApi.accuracy();
    expect(res.data).toEqual(mockAccuracy);
  });

  it('heatmap calls GET /api/stats/heatmap', async () => {
    const res = await statsApi.heatmap();
    expect(res.data).toEqual(mockHeatmap);
  });

  it('fragile calls GET /api/stats/fragile', async () => {
    const res = await statsApi.fragile();
    expect(res.data).toEqual(mockFragileCards);
  });

  it('overview handles server error', async () => {
    server.use(
      http.get('/api/stats/overview', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(statsApi.overview()).rejects.toThrow();
  });

  it('accuracy handles server error', async () => {
    server.use(
      http.get('/api/stats/accuracy', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(statsApi.accuracy()).rejects.toThrow();
  });

  it('heatmap handles server error', async () => {
    server.use(
      http.get('/api/stats/heatmap', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(statsApi.heatmap()).rejects.toThrow();
  });

  it('fragile handles server error', async () => {
    server.use(
      http.get('/api/stats/fragile', () => new HttpResponse(null, { status: 500 })),
    );

    await expect(statsApi.fragile()).rejects.toThrow();
  });
});
