import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardForm } from '../cards/CardForm';
import { I18nProvider } from '../../contexts/I18nContext';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('CardForm', () => {
  it('renders form fields', () => {
    renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
    expect(screen.getByText('Source URL')).toBeInTheDocument();
  });

  it('renders card type select with all options', () => {
    renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Check options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
  });

  it('submit calls onSubmit with correct data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithI18n(<CardForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: /front/i }), 'Question?');
    await user.type(screen.getByRole('textbox', { name: /back/i }), 'Answer.');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith({
      front: 'Question?',
      back: 'Answer.',
      cardType: 'STANDARD',
      hint: undefined,
      sourceUrl: undefined,
    });
  });

  it('submit button is disabled when front or back is empty', () => {
    renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Create')).toBeDisabled();
  });

  it('cancel button calls onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByText(/Cancel/));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows Update button when editing', () => {
    const initial = {
      id: 'card-1',
      conceptId: 'concept-1',
      front: 'Q',
      back: 'A',
      cardType: 'STANDARD' as const,
      hint: null,
      sourceUrl: null,
      repetitionCount: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: '',
      lastReviewDate: null,
      stability: 1,
      difficulty: 0.5,
      schedulingAlgorithm: 'SM2' as const,
      createdAt: '',
      updatedAt: '',
    };
    renderWithI18n(<CardForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
