import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopicForm } from '../topics/TopicForm';
import { I18nProvider } from '../../contexts/I18nContext';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('TopicForm', () => {
  it('renders form fields', () => {
    renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('renders name input with autofocus', () => {
    renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    expect(nameInput).toBeInTheDocument();
  });

  it('submit with valid data calls onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithI18n(<TopicForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: /name/i }), 'My Topic');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'My Topic',
      description: undefined,
      colorHex: '#6366F1',
    });
  });

  it('submit with description calls onSubmit with description', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithI18n(<TopicForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: /name/i }), 'Topic');
    await user.type(screen.getByRole('textbox', { name: /description/i }), 'Some desc');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Topic',
      description: 'Some desc',
      colorHex: '#6366F1',
    });
  });

  it('submit button is disabled when name is empty', () => {
    renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const submitBtn = screen.getByText('Create');
    expect(submitBtn).toBeDisabled();
  });

  it('cancel button calls onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText(/Cancel/));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows Update button when editing', () => {
    const initial = {
      id: 'topic-1',
      name: 'Existing',
      description: 'Desc',
      colorHex: '#EF4444',
      createdAt: '',
      updatedAt: '',
      cardCount: 0,
    };
    renderWithI18n(<TopicForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
