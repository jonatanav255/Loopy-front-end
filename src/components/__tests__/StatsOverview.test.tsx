import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsOverview } from '../dashboard/StatsOverview';
import { I18nProvider } from '../../contexts/I18nContext';
import { mockStatsOverview } from '../../test/mocks/data';
import type { StatsOverview as StatsOverviewType } from '../../types/stats';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('StatsOverview', () => {
  it('renders stat cards with correct values', () => {
    renderWithI18n(<StatsOverview stats={mockStatsOverview} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // cardsDueToday
    expect(screen.getByText('3')).toBeInTheDocument(); // cardsReviewedToday
    expect(screen.getByText('25')).toBeInTheDocument(); // totalCards
    expect(screen.getByText('80%')).toBeInTheDocument(); // accuracyToday
    expect(screen.getByText('7d')).toBeInTheDocument(); // currentStreak
    expect(screen.getByText('14d')).toBeInTheDocument(); // longestStreak
  });

  it('renders stat labels', () => {
    renderWithI18n(<StatsOverview stats={mockStatsOverview} />);

    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Reviews Today')).toBeInTheDocument();
    expect(screen.getByText('Total Cards')).toBeInTheDocument();
    expect(screen.getByText('Avg Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
  });

  it('handles zero/empty data', () => {
    const zeroStats: StatsOverviewType = {
      cardsDueToday: 0,
      cardsReviewedToday: 0,
      totalCards: 0,
      accuracyToday: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    renderWithI18n(<StatsOverview stats={zeroStats} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0d', { exact: true })).toBeInTheDocument();
  });
});
