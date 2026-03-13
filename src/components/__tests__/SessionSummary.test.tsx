import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionSummary } from '../review/SessionSummary';
import { I18nProvider } from '../../contexts/I18nContext';
import type { ReviewResponse } from '../../types/review';
import { mockCards } from '../../test/mocks/data';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

const mockResults: ReviewResponse[] = [
  {
    reviewLogId: 'r1',
    rating: 4,
    responseTimeMs: 3000,
    confidence: 2,
    reviewedAt: '2025-03-13T10:00:00Z',
    updatedCard: mockCards[0],
  },
  {
    reviewLogId: 'r2',
    rating: 2,
    responseTimeMs: 5000,
    confidence: 1,
    reviewedAt: '2025-03-13T10:01:00Z',
    updatedCard: mockCards[1],
  },
  {
    reviewLogId: 'r3',
    rating: 5,
    responseTimeMs: 2000,
    confidence: 3,
    reviewedAt: '2025-03-13T10:02:00Z',
    updatedCard: mockCards[0],
  },
];

describe('SessionSummary', () => {
  it('displays review results', () => {
    renderWithI18n(<SessionSummary results={mockResults} onDone={vi.fn()} />);
    // Total: 3, passed (rating >= 3): 2, accuracy: 67%
    expect(screen.getByText('3')).toBeInTheDocument(); // total
    expect(screen.getByText('2')).toBeInTheDocument(); // passed
    expect(screen.getByText('67%')).toBeInTheDocument(); // accuracy
  });

  it('displays session complete heading', () => {
    renderWithI18n(<SessionSummary results={mockResults} onDone={vi.fn()} />);
    expect(screen.getByText('Session Complete')).toBeInTheDocument();
  });

  it('back to dashboard button calls onDone', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    renderWithI18n(<SessionSummary results={mockResults} onDone={onDone} />);
    await user.click(screen.getByText('Back to Dashboard'));
    expect(onDone).toHaveBeenCalled();
  });

  it('practice again button calls onPracticeAgain when provided', async () => {
    const user = userEvent.setup();
    const onPracticeAgain = vi.fn();
    renderWithI18n(<SessionSummary results={mockResults} onDone={vi.fn()} onPracticeAgain={onPracticeAgain} />);
    await user.click(screen.getByText('Practice Again'));
    expect(onPracticeAgain).toHaveBeenCalled();
  });

  it('does not show practice again button when not provided', () => {
    renderWithI18n(<SessionSummary results={mockResults} onDone={vi.fn()} />);
    expect(screen.queryByText('Practice Again')).not.toBeInTheDocument();
  });

  it('handles empty results (0 reviewed)', () => {
    renderWithI18n(<SessionSummary results={[]} onDone={vi.fn()} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
