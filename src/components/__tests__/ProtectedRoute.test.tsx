import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { AuthProvider } from '../../contexts/AuthContext';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ProtectedRoute } from '../ui/ProtectedRoute';
import { mockUser, mockTokens } from '../../test/mocks/data';

function renderWithAuth(hasToken: boolean) {
  if (hasToken) {
    localStorage.setItem('accessToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);
  }

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<div>Login Page</div>} />
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <div>Protected Content</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders children when authenticated', async () => {
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    renderWithAuth(true);

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when not authenticated', async () => {
    renderWithAuth(false);

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('shows loading state while checking auth', () => {
    // Set token so auth check runs (and is pending)
    server.use(
      http.get('/api/auth/me', async () => {
        // Delay response to keep loading state
        await new Promise(resolve => setTimeout(resolve, 200));
        return HttpResponse.json(mockUser);
      }),
    );

    renderWithAuth(true);

    // While auth is checking, should show loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
