import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { authApi } from '../auth';
import { mockTokens, mockUser } from '../../test/mocks/data';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('login calls POST /api/auth/login with credentials', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/auth/login', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json(mockTokens);
      }),
    );

    const res = await authApi.login({ email: 'user@test.com', password: 'pass123' });
    expect(capturedBody).toEqual({ email: 'user@test.com', password: 'pass123' });
    expect(res.data.accessToken).toBe(mockTokens.accessToken);
    expect(res.data.refreshToken).toBe(mockTokens.refreshToken);
  });

  it('register calls POST /api/auth/register with email and password', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/auth/register', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json(mockTokens);
      }),
    );

    const res = await authApi.register({ email: 'new@test.com', password: 'pass123' });
    expect(capturedBody).toEqual({ email: 'new@test.com', password: 'pass123' });
    expect(res.data.accessToken).toBe(mockTokens.accessToken);
  });

  it('logout calls POST /api/auth/logout with refresh token', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/auth/logout', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await authApi.logout('my-refresh-token');
    expect(capturedBody).toEqual({ refreshToken: 'my-refresh-token' });
  });

  it('refresh calls POST /api/auth/refresh with refresh token', async () => {
    let capturedBody: Record<string, string> | null = null;
    server.use(
      http.post('/api/auth/refresh', async ({ request }) => {
        capturedBody = await request.json() as Record<string, string>;
        return HttpResponse.json(mockTokens);
      }),
    );

    const res = await authApi.refresh('old-refresh-token');
    expect(capturedBody).toEqual({ refreshToken: 'old-refresh-token' });
    expect(res.data.accessToken).toBe(mockTokens.accessToken);
  });

  it('me calls GET /api/auth/me and returns user', async () => {
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    const res = await authApi.me();
    expect(res.data).toEqual(mockUser);
  });
});
