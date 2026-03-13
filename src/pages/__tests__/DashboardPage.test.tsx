import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { DashboardPage } from '../DashboardPage';
import { mockStatsOverview } from '../../test/mocks/data';

function renderDashboard() {
  return render(
    <MemoryRouter>
      <I18nProvider>
        <ThemeProvider>
          <DashboardPage />
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders stats overview after loading', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Check stats values are displayed
    expect(screen.getByText(String(mockStatsOverview.cardsDueToday))).toBeInTheDocument();
    expect(screen.getByText(String(mockStatsOverview.totalCards))).toBeInTheDocument();
  });

  it('renders heatmap', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Activity/)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    // Make stats slow to respond
    server.use(
      http.get('/api/stats/overview', async () => {
        await new Promise(r => setTimeout(r, 200));
        return HttpResponse.json(mockStatsOverview);
      }),
      http.get('/api/stats/accuracy', async () => {
        await new Promise(r => setTimeout(r, 200));
        return HttpResponse.json([]);
      }),
      http.get('/api/stats/heatmap', async () => {
        await new Promise(r => setTimeout(r, 200));
        return HttpResponse.json([]);
      }),
      http.get('/api/stats/fragile', async () => {
        await new Promise(r => setTimeout(r, 200));
        return HttpResponse.json([]);
      }),
    );

    const { container } = renderDashboard();
    // Should show spinner during loading
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows review cards button when cards are due', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Review \d+ cards/)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    server.use(
      http.get('/api/stats/overview', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/accuracy', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/heatmap', () => new HttpResponse(null, { status: 500 })),
      http.get('/api/stats/fragile', () => new HttpResponse(null, { status: 500 })),
    );

    renderDashboard();

    await waitFor(() => {
      // Should still render the dashboard title after loading
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
