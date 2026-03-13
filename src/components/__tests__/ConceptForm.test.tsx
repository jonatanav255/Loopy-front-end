import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptForm } from '../topics/ConceptForm';
import { I18nProvider } from '../../contexts/I18nContext';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('ConceptForm', () => {
  it('renders form fields', () => {
    renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('submit with valid data calls onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithI18n(<ConceptForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    const inputs = screen.getAllByRole('textbox');
    // First is title, second is notes
    await user.type(inputs[0], 'Closures');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Closures',
      notes: undefined,
      referenceExplanation: undefined,
    });
  });

  it('submit button is disabled when title is empty', () => {
    renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const submitBtn = screen.getByText('Create');
    expect(submitBtn).toBeDisabled();
  });

  it('cancel button calls onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByText(/Cancel/));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows referenceExplanation field when editing', () => {
    const initial = {
      id: 'concept-1',
      topicId: 'topic-1',
      title: 'Closures',
      notes: 'Some notes',
      referenceExplanation: 'Ref explanation',
      status: 'LEARNING' as const,
      createdAt: '',
      updatedAt: '',
    };
    renderWithI18n(<ConceptForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Reference Explanation')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('does not show referenceExplanation field when creating', () => {
    renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByText('Reference Explanation')).not.toBeInTheDocument();
  });
});
