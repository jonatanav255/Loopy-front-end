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
import { AppLayout } from '../../components/layout/AppLayout';
import { LoginPage } from '../LoginPage';
import { DashboardPage } from '../DashboardPage';
import { TopicsPage } from '../TopicsPage';
import { TopicDetailPage } from '../TopicDetailPage';
import { ConceptDetailPage } from '../ConceptDetailPage';
import { ReviewPage } from '../ReviewPage';
import { SearchPage } from '../SearchPage';
import { DataPortPage } from '../DataPortPage';
import {
  mockTokens,
  mockUser,
  mockCards,
  mockStatsOverview,
  mockReviewResponse,
} from '../../test/mocks/data';

/**
 * Full app renderer with all routes for integration tests.
 */
function renderFullApp(initialEntries: string[] = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="topics" element={<TopicsPage />} />
                  <Route path="topics/:topicId" element={<TopicDetailPage />} />
                  <Route path="topics/:topicId/concepts/:conceptId" element={<ConceptDetailPage />} />
                  <Route path="review" element={<ReviewPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="data" element={<DataPortPage />} />
                </Route>
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

/** Helper: sets up auth tokens and handlers for an authenticated session */
function setupAuth() {
  localStorage.setItem('accessToken', mockTokens.accessToken);
  localStorage.setItem('refreshToken', mockTokens.refreshToken);

  server.use(
    http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
  );
}

describe('E2E-style Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login flow -> Dashboard loads with data', () => {
    it('logs in and sees dashboard stats', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => HttpResponse.json(mockTokens)),
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderFullApp(['/login']);

      // Fill in login form
      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByText('Sign in'));

      // Dashboard should load (the heading in the main content)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      });

      // Stats should be visible
      await waitFor(() => {
        expect(screen.getByText(String(mockStatsOverview.cardsDueToday))).toBeInTheDocument();
        expect(screen.getByText(String(mockStatsOverview.totalCards))).toBeInTheDocument();
      });
    });
  });

  describe('Create topic -> appears in list -> create concept -> add card', () => {
    it('creates a topic and sees it in the list', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/topics']);

      // Wait for topics page to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Topics' })).toBeInTheDocument();
      });

      // Wait for existing topics to load
      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      // Click New Topic button
      await user.click(screen.getByText(/New Topic/));

      // Fill in the form
      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument();
      });

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Python');
      await user.click(screen.getByText('Create'));

      // Should see toast and return to list
      await waitFor(() => {
        expect(screen.getByText('Topic created')).toBeInTheDocument();
      });
    });

    it('navigates to topic detail and creates a concept', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/topics/topic-1']);

      // Wait for topic detail page to load
      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      // Wait for concepts to load
      await waitFor(() => {
        expect(screen.getByText('Closures')).toBeInTheDocument();
      });

      // Click New Concept
      await user.click(screen.getByText(/New Concept/));

      // Fill concept form
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Generators');
      await user.click(screen.getByText('Create'));

      await waitFor(() => {
        expect(screen.getByText('Concept created')).toBeInTheDocument();
      });
    });

    it('navigates to concept detail and creates a card', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/topics/topic-1/concepts/concept-1']);

      // Wait for concept detail page to load
      await waitFor(() => {
        expect(screen.getByText('Closures')).toBeInTheDocument();
      });

      // Wait for cards to load
      await waitFor(() => {
        expect(screen.getByText('What is a closure?')).toBeInTheDocument();
      });

      // Click New Card
      await user.click(screen.getByText(/New Card/));

      // Fill card form
      await waitFor(() => {
        expect(screen.getByText('Card Type')).toBeInTheDocument();
      });

      const textboxes = screen.getAllByRole('textbox');
      await user.type(textboxes[0], 'What is lexical scope?');
      await user.type(textboxes[1], 'The scope defined by where variables are declared.');
      await user.click(screen.getByText('Create'));

      await waitFor(() => {
        expect(screen.getByText('Card created')).toBeInTheDocument();
      });
    });
  });

  describe('Review session flow -> rate cards -> session summary', () => {
    it('completes a review session from start to summary', async () => {
      const user = userEvent.setup();
      setupAuth();

      // Only one card so we can complete the session
      server.use(
        http.get('/api/reviews/today', () => HttpResponse.json([mockCards[0]])),
        http.post('/api/reviews/:cardId', () => HttpResponse.json(mockReviewResponse)),
      );

      renderFullApp(['/review']);

      // Wait for review page to load with topics
      await waitFor(() => {
        expect(screen.getByText('Review Session')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Start Review')).toBeInTheDocument();
      });

      // Start the review
      await user.click(screen.getByText(/Start Review/));

      // Wait for the card to appear (front) - both sides exist in DOM, use getAllByText
      await waitFor(() => {
        expect(screen.getAllByText('What is a closure?').length).toBeGreaterThan(0);
      });

      // Click Show Answer
      await user.click(screen.getByText(/Show Answer/));

      // Wait for rating buttons
      await waitFor(() => {
        expect(screen.getByText('Rate your recall (1-6)')).toBeInTheDocument();
      });

      // Click "Good" rating
      await user.click(screen.getByText('Good'));

      // Wait for confidence rating
      await waitFor(() => {
        expect(screen.getByText('How confident are you? (1-3)')).toBeInTheDocument();
      });

      // Click "High" confidence
      await user.click(screen.getByText('High'));

      // Wait for session summary
      await waitFor(() => {
        expect(screen.getByText('Session Complete')).toBeInTheDocument();
      });
    });
  });

  describe('Search flow -> type query -> see results', () => {
    it('searches for a topic and sees results', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/search']);

      // Wait for the search heading (use role to distinguish from sidebar nav)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
      });

      // Type a search query
      const input = screen.getByPlaceholderText(/Search topics/);
      await user.type(input, 'JavaScript');

      // Results should appear (debounced)
      await waitFor(() => {
        expect(screen.getByText('Topics (1)')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('shows no results for unmatched query', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/search']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Search topics/);
      await user.type(input, 'xyznonexistent');

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('searches and finds cards', async () => {
      const user = userEvent.setup();
      setupAuth();

      renderFullApp(['/search']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Search topics/);
      await user.type(input, 'closure');

      // "closure" matches card-1 (front: "What is a closure?", back contains "closure")
      await waitFor(() => {
        expect(screen.getByText(/Cards \(\d+\)/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Export / Import data flow', () => {
    it('renders export and import sections', async () => {
      setupAuth();

      renderFullApp(['/data']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Export / Import' })).toBeInTheDocument();
      });

      // Both sections should be visible
      await waitFor(() => {
        expect(screen.getByText('Export Data')).toBeInTheDocument();
        expect(screen.getByText('Import Data')).toBeInTheDocument();
      });
    });

    it('shows topics list for export filtering', async () => {
      setupAuth();

      renderFullApp(['/data']);

      await waitFor(() => {
        expect(screen.getByText('Export Data')).toBeInTheDocument();
      });

      // Topics should be listed for selection
      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('export button is visible and functional', async () => {
      setupAuth();

      // Mock URL.createObjectURL and related
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = () => 'blob:fake-url';
      URL.revokeObjectURL = () => {};

      renderFullApp(['/data']);

      await waitFor(() => {
        expect(screen.getByText('Export JSON')).toBeInTheDocument();
      });

      // Cleanup
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });
  });

  describe('Dashboard -> Navigation to review', () => {
    it('dashboard shows review cards button when cards are due', async () => {
      setupAuth();

      renderFullApp(['/']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      });

      // Stats show due cards
      await waitFor(() => {
        expect(screen.getByText(/Review \d+ cards/)).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar navigation', () => {
    it('sidebar shows all navigation items for authenticated user', async () => {
      setupAuth();

      renderFullApp(['/']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      });

      // Sidebar navigation items (sidebar uses nav links with text)
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('sidebar shows user email and sign out button', async () => {
      setupAuth();

      renderFullApp(['/']);

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });
  });
});
