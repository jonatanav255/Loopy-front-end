import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfidenceRating } from '../review/ConfidenceRating';
import { I18nProvider } from '../../contexts/I18nContext';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('ConfidenceRating', () => {
  it('renders 3 confidence buttons', () => {
    const onSelect = vi.fn();
    renderWithI18n(<ConfidenceRating onSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('displays confidence labels', () => {
    const onSelect = vi.fn();
    renderWithI18n(<ConfidenceRating onSelect={onSelect} />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('clicking Low calls onSelect with 1', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(<ConfidenceRating onSelect={onSelect} />);
    await user.click(screen.getByText('Low'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('clicking Medium calls onSelect with 2', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(<ConfidenceRating onSelect={onSelect} />);
    await user.click(screen.getByText('Medium'));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('clicking High calls onSelect with 3', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithI18n(<ConfidenceRating onSelect={onSelect} />);
    await user.click(screen.getByText('High'));
    expect(onSelect).toHaveBeenCalledWith(3);
  });
});
