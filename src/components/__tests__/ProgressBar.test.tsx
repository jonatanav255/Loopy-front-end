import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../review/ProgressBar';

describe('ProgressBar', () => {
  it('renders correct progress text', () => {
    render(<ProgressBar current={3} total={10} />);
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    const { container } = render(<ProgressBar current={5} total={10} />);
    const bar = container.querySelector('[style]');
    expect(bar?.getAttribute('style')).toContain('width: 50%');
  });

  it('handles zero total without division error', () => {
    render(<ProgressBar current={0} total={0} />);
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('shows 100% when current equals total', () => {
    const { container } = render(<ProgressBar current={10} total={10} />);
    const bar = container.querySelector('[style]');
    expect(bar?.getAttribute('style')).toContain('width: 100%');
  });
});
