import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import api from '../client';

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('includes Authorization header when access token exists in localStorage', async () => {
    localStorage.setItem('accessToken', 'test-token-123');

    let capturedAuth = '';
    server.use(
      http.get('/api/test-endpoint', ({ request }) => {
        capturedAuth = request.headers.get('Authorization') ?? '';
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get('/test-endpoint');
    expect(capturedAuth).toBe('Bearer test-token-123');
  });

  it('includes Authorization header when access token exists in sessionStorage', async () => {
    sessionStorage.setItem('accessToken', 'session-token-456');

    let capturedAuth = '';
    server.use(
      http.get('/api/test-endpoint', ({ request }) => {
        capturedAuth = request.headers.get('Authorization') ?? '';
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get('/test-endpoint');
    expect(capturedAuth).toBe('Bearer session-token-456');
  });

  it('does not include Authorization header when no token exists', async () => {
    let capturedAuth: string | null = 'NOT_NULL';
    server.use(
      http.get('/api/test-endpoint', ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get('/test-endpoint');
    expect(capturedAuth).toBeNull();
  });

  it('retries request with new token after 401 response triggers refresh', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.setItem('refreshToken', 'valid-refresh');

    let callCount = 0;
    server.use(
      http.get('/api/protected', () => {
        callCount++;
        if (callCount === 1) {
          return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json({ data: 'success' });
      }),
      http.post('/api/auth/refresh', () => {
        return HttpResponse.json({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 3600,
        });
      }),
    );

    const res = await api.get('/protected');
    expect(res.data).toEqual({ data: 'success' });
    expect(callCount).toBe(2);
    expect(localStorage.getItem('accessToken')).toBe('new-access-token');
  });

  it('clears storage and redirects to login when refresh fails', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.setItem('refreshToken', 'invalid-refresh');

    // Mock window.location.href
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });

    server.use(
      http.get('/api/protected', () => {
        return new HttpResponse(null, { status: 401 });
      }),
      http.post('/api/auth/refresh', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    await expect(api.get('/protected')).rejects.toThrow();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(window.location.href).toBe('/login');

    // Restore
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('redirects to login when 401 with no refresh token', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    // No refresh token stored

    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });

    server.use(
      http.get('/api/protected', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    await expect(api.get('/protected')).rejects.toThrow();
    expect(window.location.href).toBe('/login');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
