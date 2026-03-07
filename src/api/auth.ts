import api from './client';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../types/auth';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<TokenResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<TokenResponse>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  me: () =>
    api.get<UserResponse>('/auth/me'),
};
