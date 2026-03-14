// Dependencies: axe, configureAxe (vitest-axe), render, waitFor — see DEPENDENCY_GUIDE.md
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { axe, configureAxe } from 'vitest-axe';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { AuthProvider } from '../../contexts/AuthContext';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { DashboardPage } from '../DashboardPage';
import { TopicsPage } from '../TopicsPage';
import { SearchPage } from '../SearchPage';
import { DataPortPage } from '../DataPortPage';
import { ReviewPage } from '../ReviewPage';
import { mockUser, mockTokens } from '../../test/mocks/data';

/**
 * Axe configured to skip known issues:
 * - color-contrast: not computable in jsdom
 * - label: some inputs lack htmlFor/id pairing (known issue)
 * - button-name: color swatch/theme buttons (known issue)
 * - nested-interactive: dnd-kit sortable items contain buttons (known issue)
 */
const axeWithKnownIssues = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
    'label': { enabled: false },
    'button-name': { enabled: false },
    'nested-interactive': { enabled: false },
  },
});

function renderPage(page: React.ReactElement, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="*" element={page} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('Page Accessibility (axe-core)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('LoginPage', () => {
    it('has no a11y violations', async () => {
      const { container } = renderPage(<LoginPage />, '/login');
      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('RegisterPage', () => {
    it('has no a11y violations', async () => {
      const { container } = renderPage(<RegisterPage />, '/register');
      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('DashboardPage', () => {
    it('has no a11y violations after loading', async () => {
      const { container } = render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <DashboardPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TopicsPage', () => {
    it('has no a11y violations after loading (excluding known dnd-kit issues)', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      server.use(http.get('/api/auth/me', () => HttpResponse.json(mockUser)));

      const { container } = render(
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

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });

    it('detects nested-interactive violation from dnd-kit sortable items', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      server.use(http.get('/api/auth/me', () => HttpResponse.json(mockUser)));

      const { container } = render(
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

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false },
          'label': { enabled: false },
          'button-name': { enabled: false },
        },
      });
      const nestedViolation = results.violations.find(v => v.id === 'nested-interactive');
      expect(nestedViolation).toBeDefined();
    });
  });

  describe('SearchPage', () => {
    it('has no a11y violations', async () => {
      const { container } = render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <SearchPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('DataPortPage', () => {
    it('has no a11y violations after loading (excluding known issues)', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      server.use(http.get('/api/auth/me', () => HttpResponse.json(mockUser)));

      const { container } = render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <DataPortPage />
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });

    it('detects label violation for hidden file input', async () => {
      localStorage.setItem('accessToken', mockTokens.accessToken);
      server.use(http.get('/api/auth/me', () => HttpResponse.json(mockUser)));

      const { container } = render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <DataPortPage />
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false },
          'button-name': { enabled: false },
          'nested-interactive': { enabled: false },
        },
      });
      const labelViolation = results.violations.find(v => v.id === 'label');
      expect(labelViolation).toBeDefined();
    });
  });

  describe('ReviewPage', () => {
    it('has no a11y violations on idle state', async () => {
      const { container } = render(
        <MemoryRouter>
          <I18nProvider>
            <ThemeProvider>
              <ReviewPage />
            </ThemeProvider>
          </I18nProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      });

      const results = await axeWithKnownIssues(container);
      expect(results).toHaveNoViolations();
    });
  });
});
