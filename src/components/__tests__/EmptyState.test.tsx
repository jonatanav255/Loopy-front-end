import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../ui/EmptyState';

describe('EmptyState', () => {
  it('renders title message', () => {
    render(<EmptyState title="No items yet" />);
    expect(screen.getByText('No items yet')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Create your first item" />);
    expect(screen.getByText('Create your first item')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders action button when provided', () => {
    const onClick = vi.fn();
    render(<EmptyState title="Empty" action={{ label: 'Add Item', onClick }} />);
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('action button calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<EmptyState title="Empty" action={{ label: 'Add Item', onClick }} />);
    await user.click(screen.getByText('Add Item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
