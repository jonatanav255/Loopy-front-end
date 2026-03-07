import api from './client';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../types/auth';

/** Type-safe wrapper for all auth-related API calls. */
export const authApi = {
  /** Create a new account — returns tokens for immediate login. */
  register: (data: RegisterRequest) =>
    api.post<TokenResponse>('/auth/register', data),

  /** Authenticate with email/password — returns access + refresh tokens. */
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/auth/login', data),

  /** Exchange refresh token for a new token pair (rotation). */
  refresh: (refreshToken: string) =>
    api.post<TokenResponse>('/auth/refresh', { refreshToken }),

  /** Revoke the refresh token on the server. */
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  /** Get the currently authenticated user's profile. Requires valid access token. */
  me: () =>
    api.get<UserResponse>('/auth/me'),
};
