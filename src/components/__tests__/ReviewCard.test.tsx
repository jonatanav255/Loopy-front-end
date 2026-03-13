import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewCard } from '../review/ReviewCard';
import { I18nProvider } from '../../contexts/I18nContext';
import { mockCards } from '../../test/mocks/data';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre data-testid="code-block">{children}</pre>,
}));
vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

const card = mockCards[0];

describe('ReviewCard', () => {
  it('renders two faces (front and back) stacked via flip CSS', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    const faces = container.querySelectorAll('.flip-card-face');
    expect(faces).toHaveLength(2);
  });

  it('front face has flip-face-front class', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    const front = container.querySelector('.flip-face-front');
    expect(front).toBeInTheDocument();
  });

  it('back face has flip-face-back and flip-card-back classes', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    const back = container.querySelector('.flip-face-back');
    expect(back).toBeInTheDocument();
    expect(back).toHaveClass('flip-card-back');
  });

  it('does not apply flipped class when showBack is false', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    const inner = container.querySelector('.flip-card-inner');
    expect(inner).not.toHaveClass('flipped');
  });

  it('applies flipped class when showBack is true', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={true} onReveal={vi.fn()} />
    );

    const inner = container.querySelector('.flip-card-inner');
    expect(inner).toHaveClass('flipped');
  });

  it('shows "Show Answer" button when showBack is false', () => {
    renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    expect(screen.getByText('Show Answer (Space)')).toBeInTheDocument();
  });

  it('hides "Show Answer" button when showBack is true', () => {
    renderWithI18n(
      <ReviewCard card={card} showBack={true} onReveal={vi.fn()} />
    );

    expect(screen.queryByText('Show Answer (Space)')).not.toBeInTheDocument();
  });

  it('calls onReveal when "Show Answer" button is clicked', async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={onReveal} />
    );

    await user.click(screen.getByText('Show Answer (Space)'));
    expect(onReveal).toHaveBeenCalledOnce();
  });

  it('renders question text on both faces', () => {
    renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    // Both front and back face contain the question
    const matches = screen.getAllByText(/What is a closure/);
    expect(matches).toHaveLength(2);
  });

  it('renders hint on front face only', () => {
    renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    expect(screen.getByText(/Think about scope/)).toBeInTheDocument();
  });

  it('renders answer on back face', () => {
    renderWithI18n(
      <ReviewCard card={card} showBack={true} onReveal={vi.fn()} />
    );

    expect(screen.getByText(/captures variables from its enclosing scope/)).toBeInTheDocument();
  });

  it('"Show Answer" button is outside the flip-card container', () => {
    const { container } = renderWithI18n(
      <ReviewCard card={card} showBack={false} onReveal={vi.fn()} />
    );

    const flipCard = container.querySelector('.flip-card');
    const button = screen.getByText('Show Answer (Space)');
    expect(flipCard?.contains(button)).toBe(false);
  });
});
