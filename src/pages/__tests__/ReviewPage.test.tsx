import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ReviewPage } from '../ReviewPage';
import { mockTopics, mockCards, mockReviewResponse } from '../../test/mocks/data';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre data-testid="code-block">{children}</pre>,
}));
vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));

function renderReviewPage() {
  return render(
    <MemoryRouter>
      <I18nProvider>
        <ThemeProvider>
          <ReviewPage />
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('ReviewPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders topic selection', async () => {
    renderReviewPage();

    await waitFor(() => {
      expect(screen.getByText('Review Session')).toBeInTheDocument();
    });

    // Should show topics with cards
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Start Review')).toBeInTheDocument();
  });

  it('starts review session when button clicked', async () => {
    const user = userEvent.setup();
    renderReviewPage();

    await waitFor(() => {
      expect(screen.getByText('Start Review')).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Start Review/));

    await waitFor(() => {
      // Should show the first card
      expect(screen.getByText(/What is a closure/)).toBeInTheDocument();
    });
  });

  it('shows card and answer toggle (reveal)', async () => {
    const user = userEvent.setup();
    renderReviewPage();

    await waitFor(() => {
      expect(screen.getByText('Start Review')).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Start Review/));

    await waitFor(() => {
      expect(screen.getByText(/What is a closure/)).toBeInTheDocument();
    });

    // Show answer button should be visible
    expect(screen.getByText('Show Answer (Space)')).toBeInTheDocument();
    await user.click(screen.getByText('Show Answer (Space)'));

    // After reveal, should show rating buttons
    await waitFor(() => {
      expect(screen.getByText('Again')).toBeInTheDocument();
      expect(screen.getByText('Good')).toBeInTheDocument();
    });
  });

  it('rating submission shows confidence buttons', async () => {
    const user = userEvent.setup();
    renderReviewPage();

    await waitFor(() => expect(screen.getByText('Start Review')).toBeInTheDocument());

    await user.click(screen.getByText(/Start Review/));
    await waitFor(() => expect(screen.getByText(/What is a closure/)).toBeInTheDocument());

    await user.click(screen.getByText('Show Answer (Space)'));
    await waitFor(() => expect(screen.getByText('Good')).toBeInTheDocument());

    await user.click(screen.getByText('Good'));

    // Should show confidence rating
    await waitFor(() => {
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  it('shows session summary at end with only one card', async () => {
    const user = userEvent.setup();

    // Only one card
    server.use(
      http.get('/api/reviews/today', () => {
        return HttpResponse.json([mockCards[0]]);
      }),
      http.post('/api/reviews/:cardId', () => {
        return HttpResponse.json(mockReviewResponse);
      }),
    );

    renderReviewPage();

    await waitFor(() => expect(screen.getByText('Start Review')).toBeInTheDocument());

    await user.click(screen.getByText(/Start Review/));
    await waitFor(() => expect(screen.getByText(/What is a closure/)).toBeInTheDocument());

    await user.click(screen.getByText('Show Answer (Space)'));
    await waitFor(() => expect(screen.getByText('Good')).toBeInTheDocument());

    await user.click(screen.getByText('Good'));
    await waitFor(() => expect(screen.getByText('Medium')).toBeInTheDocument());

    await user.click(screen.getByText('Medium'));

    await waitFor(() => {
      expect(screen.getByText('Session Complete')).toBeInTheDocument();
    });
  });

  it('shows all caught up when no cards due', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/reviews/today', () => {
        return HttpResponse.json([]);
      }),
    );

    renderReviewPage();

    await waitFor(() => expect(screen.getByText('Start Review')).toBeInTheDocument());
    await user.click(screen.getByText(/Start Review/));

    await waitFor(() => {
      expect(screen.getByText('All caught up!')).toBeInTheDocument();
    });
  });

  it('shows no topics found when no topics with cards', async () => {
    server.use(
      http.get('/api/topics', () => {
        return HttpResponse.json(mockTopics.map(t => ({ ...t, cardCount: 0 })));
      }),
    );

    renderReviewPage();

    await waitFor(() => {
      expect(screen.getByText(/No topics found/)).toBeInTheDocument();
    });
  });
});
