import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { AuthProvider } from '../../contexts/AuthContext';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { ProtectedRoute } from '../../components/ui/ProtectedRoute';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { DashboardPage } from '../DashboardPage';
import { TopicsPage } from '../TopicsPage';
import { SearchPage } from '../SearchPage';
import { mockTokens, mockUser } from '../../test/mocks/data';

/**
 * Renders a mini app with all the routes needed for navigation tests.
 */
function renderApp(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/topics"
                  element={
                    <ProtectedRoute>
                      <TopicsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all: redirect to dashboard */}
                <Route path="*" element={<div>Not Found - Redirected</div>} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('Router / Navigation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Auth guards (ProtectedRoute)', () => {
    it('redirects unauthenticated users from / to /login', async () => {
      renderApp(['/']);

      await waitFor(() => {
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      });
    });

    it('redirects unauthenticated users from /topics to /login', async () => {
      renderApp(['/topics']);

      await waitFor(() => {
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      });
    });

    it('redirects unauthenticated users from /search to /login', async () => {
      renderApp(['/search']);

      await waitFor(() => {
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      });
    });

    it('shows loading state while checking auth with a token', () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);

      server.use(
        http.get('/api/auth/me', async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          return HttpResponse.json(mockUser);
        }),
      );

      renderApp(['/']);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('authenticated users can access protected pages', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      localStorage.setItem('refreshToken', mockTokens.refreshToken);

      server.use(
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderApp(['/topics']);

      await waitFor(() => {
        expect(screen.getByText('Topics')).toBeInTheDocument();
      });
    });

    it('authenticated users can access the dashboard', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      localStorage.setItem('refreshToken', mockTokens.refreshToken);

      server.use(
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderApp(['/']);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Deep linking', () => {
    it('deep links to /login renders the login page', () => {
      renderApp(['/login']);

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    it('deep links to /register renders the register page', () => {
      renderApp(['/register']);

      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });
  });

  describe('Navigation between pages', () => {
    it('navigates from login to register page', async () => {
      const user = userEvent.setup();

      renderApp(['/login']);

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();

      // Click the Register link
      await user.click(screen.getByText('Register'));

      await waitFor(() => {
        expect(screen.getByText('Create your account')).toBeInTheDocument();
      });
    });

    it('navigates from register to login page', async () => {
      const user = userEvent.setup();

      renderApp(['/register']);

      expect(screen.getByText('Create your account')).toBeInTheDocument();

      // Click Sign in link
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      });
    });
  });

  describe('Redirect after login', () => {
    it('redirects to dashboard after successful login', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => HttpResponse.json(mockTokens)),
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderApp(['/login']);

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('redirects to dashboard after successful registration', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/register', () => HttpResponse.json(mockTokens)),
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderApp(['/register']);

      await user.type(screen.getByLabelText('Email'), 'new@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.type(screen.getByLabelText('Confirm Password'), 'password123');
      await user.click(screen.getByText('Create account'));

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('404 / catch-all routes', () => {
    it('renders fallback for unknown routes when unauthenticated', async () => {
      renderApp(['/nonexistent-page']);

      await waitFor(() => {
        expect(screen.getByText('Not Found - Redirected')).toBeInTheDocument();
      });
    });
  });

  describe('Public routes accessible without auth', () => {
    it('login page is accessible without authentication', () => {
      renderApp(['/login']);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('register page is accessible without authentication', () => {
      renderApp(['/register']);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByText('Create account')).toBeInTheDocument();
    });
  });
});
