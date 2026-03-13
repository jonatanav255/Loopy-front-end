import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { useAuth } from '../useAuth';
import { createWrapper } from '../../test/utils';
import { mockTokens, mockUser } from '../../test/mocks/data';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts with no user and loading true', () => {
    // Override /auth/me to delay to keep loading = true
    server.use(
      http.get('/api/auth/me', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    // Initially loading should be true (before auth check resolves)
    expect(result.current.user).toBeNull();
  });

  it('login sets user and stores tokens', async () => {
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json(mockTokens);
      }),
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Wait for initial loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('test@example.com', 'password123', true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('accessToken')).toBe(mockTokens.accessToken);
    expect(localStorage.getItem('refreshToken')).toBe(mockTokens.refreshToken);
  });

  it('login with rememberMe=false stores tokens in sessionStorage', async () => {
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json(mockTokens);
      }),
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('test@example.com', 'password123', false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(sessionStorage.getItem('accessToken')).toBe(mockTokens.accessToken);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('logout clears user and tokens', async () => {
    localStorage.setItem('accessToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);

    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
      http.post('/api/auth/logout', () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('auto-login from stored token on mount', async () => {
    localStorage.setItem('accessToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);

    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('clears tokens when stored token is invalid', async () => {
    localStorage.setItem('accessToken', 'invalid-token');
    localStorage.setItem('refreshToken', 'invalid-refresh');

    server.use(
      http.get('/api/auth/me', () => {
        return new HttpResponse(null, { status: 401 });
      }),
      http.post('/api/auth/refresh', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    // Mock window.location to prevent actual navigation
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
