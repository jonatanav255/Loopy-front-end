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
import { DashboardPage } from '../DashboardPage';
import { TopicsPage } from '../TopicsPage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { SearchPage } from '../SearchPage';
import { ReviewPage } from '../ReviewPage';
import { mockTokens, mockUser, mockTopics } from '../../test/mocks/data';

function renderWithProviders(ui: React.ReactElement, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="*" element={ui} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('Error Boundary / API Failure Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Dashboard — API failures', () => {
    it('handles 500 errors from stats endpoints gracefully', async () => {
      server.use(
        http.get('/api/stats/overview', () => new HttpResponse(null, { status: 500 })),
        http.get('/api/stats/accuracy', () => new HttpResponse(null, { status: 500 })),
        http.get('/api/stats/heatmap', () => new HttpResponse(null, { status: 500 })),
        http.get('/api/stats/fragile', () => new HttpResponse(null, { status: 500 })),
      );

      render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <DashboardPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      // Dashboard should recover from errors and render
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('handles network errors from stats endpoints', async () => {
      server.use(
        http.get('/api/stats/overview', () => HttpResponse.error()),
        http.get('/api/stats/accuracy', () => HttpResponse.error()),
        http.get('/api/stats/heatmap', () => HttpResponse.error()),
        http.get('/api/stats/fragile', () => HttpResponse.error()),
      );

      render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <DashboardPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Login — API failures', () => {
    it('shows error message on 500 server error', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => new HttpResponse(null, { status: 500 })),
      );

      renderWithProviders(<LoginPage />, '/login');

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Login failed')).toBeInTheDocument();
      });
    });

    it('shows error message on network error', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => HttpResponse.error()),
      );

      renderWithProviders(<LoginPage />, '/login');

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Login failed')).toBeInTheDocument();
      });
    });

    it('shows specific error message from API response', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 },
          );
        }),
      );

      renderWithProviders(<LoginPage />, '/login');

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'wrong');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('re-enables submit button after failed login', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({ error: 'Bad request' }, { status: 400 });
        }),
      );

      renderWithProviders(<LoginPage />, '/login');

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Sign in')).not.toBeDisabled();
      });
    });
  });

  describe('Register — API failures', () => {
    it('shows error message on 500 server error', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/register', () => new HttpResponse(null, { status: 500 })),
      );

      renderWithProviders(<RegisterPage />, '/register');

      await user.type(screen.getByLabelText('Email'), 'new@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.type(screen.getByLabelText('Confirm Password'), 'password123');
      await user.click(screen.getByText('Create account'));

      await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument();
      });
    });

    it('shows specific error from API on duplicate email', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/register', () => {
          return HttpResponse.json(
            { error: 'Email already registered' },
            { status: 409 },
          );
        }),
      );

      renderWithProviders(<RegisterPage />, '/register');

      await user.type(screen.getByLabelText('Email'), 'existing@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.type(screen.getByLabelText('Confirm Password'), 'password123');
      await user.click(screen.getByText('Create account'));

      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });
    });
  });

  describe('Topics — API failures', () => {
    it('handles failed topic listing gracefully', async () => {
      server.use(
        http.get('/api/topics', () => new HttpResponse(null, { status: 500 })),
      );

      localStorage.setItem('accessToken', mockTokens.accessToken);
      server.use(http.get('/api/auth/me', () => HttpResponse.json(mockUser)));

      render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <TopicsPage />
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      // Page should still render even if API fails
      await waitFor(() => {
        expect(screen.getByText('Topics')).toBeInTheDocument();
      });
    });
  });

  describe('Auth — expired token handling', () => {
    it('clears auth state when /me returns 401', async () => {
      localStorage.setItem('accessToken', 'expired-token');
      localStorage.setItem('refreshToken', 'expired-refresh');

      server.use(
        http.get('/api/auth/me', () => new HttpResponse(null, { status: 401 })),
        http.post('/api/auth/refresh', () => new HttpResponse(null, { status: 401 })),
      );

      render(
        <MemoryRouter initialEntries={['/login']}>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                  </Routes>
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      // Should show login page — auth state was cleared
      await waitFor(() => {
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      });
    });
  });

  describe('Search — API failures', () => {
    it('handles search API errors gracefully', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('/api/search', () => new HttpResponse(null, { status: 500 })),
      );

      render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <SearchPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      const input = screen.getByPlaceholderText(/Search topics/);
      await user.type(input, 'test query');

      // Page should not crash; it may show no results or search state
      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Review — API failures', () => {
    it('handles failed card loading by returning to idle', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('/api/topics', () => HttpResponse.json(mockTopics)),
        http.get('/api/reviews/today', () => HttpResponse.error()),
      );

      render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <ReviewPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      // Wait for topics to load
      await waitFor(() => {
        expect(screen.getByText('Start Review')).toBeInTheDocument();
      });

      // Click start review
      await user.click(screen.getByText(/Start Review/));

      // Should return to idle state after failure
      await waitFor(() => {
        expect(screen.getByText('Start Review')).toBeInTheDocument();
      });
    });
  });
});
