import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingButtons } from '../review/RatingButtons';
import { I18nProvider } from '../../contexts/I18nContext';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('RatingButtons', () => {
  it('renders 6 rating buttons', () => {
    const onRate = vi.fn();
    renderWithI18n(<RatingButtons onRate={onRate} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('displays rating labels', () => {
    const onRate = vi.fn();
    renderWithI18n(<RatingButtons onRate={onRate} />);
    expect(screen.getByText('Again')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Difficult')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('clicking button calls onRate with value 0 for Again', async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();
    renderWithI18n(<RatingButtons onRate={onRate} />);
    await user.click(screen.getByText('Again'));
    expect(onRate).toHaveBeenCalledWith(0);
  });

  it('clicking button calls onRate with value 3 for OK', async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();
    renderWithI18n(<RatingButtons onRate={onRate} />);
    await user.click(screen.getByText('OK'));
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('clicking button calls onRate with value 5 for Easy', async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();
    renderWithI18n(<RatingButtons onRate={onRate} />);
    await user.click(screen.getByText('Easy'));
    expect(onRate).toHaveBeenCalledWith(5);
  });
});
