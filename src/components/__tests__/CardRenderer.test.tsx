import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardRenderer } from '../cards/CardRenderer';

// Mock react-syntax-highlighter to avoid complex rendering in tests
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre data-testid="code-block">{children}</pre>,
}));
vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));

describe('CardRenderer', () => {
  it('renders plain text', () => {
    render(<CardRenderer front="What is a closure?" cardType="STANDARD" />);
    expect(screen.getByText('What is a closure?')).toBeInTheDocument();
  });

  it('renders bold text (**text**)', () => {
    render(<CardRenderer front="This is **important** text" cardType="STANDARD" />);
    const bold = screen.getByText('important');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renders inline code (`code`)', () => {
    render(<CardRenderer front="Use the `map` function" cardType="STANDARD" />);
    const code = screen.getByText('map');
    expect(code.tagName).toBe('CODE');
  });

  it('renders code blocks (```code```)', () => {
    render(
      <CardRenderer
        front={'```javascript\nconsole.log("hello");\n```'}
        cardType="CODE_OUTPUT"
      />,
    );
    expect(screen.getByTestId('code-block')).toBeInTheDocument();
    expect(screen.getByText('console.log("hello");')).toBeInTheDocument();
  });

  it('renders multiple formatting types together', () => {
    render(
      <CardRenderer
        front="**Bold** and `code` in one line"
        cardType="STANDARD"
      />,
    );
    expect(screen.getByText('Bold').tagName).toBe('STRONG');
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('renders card type badge', () => {
    render(<CardRenderer front="question" cardType="SPOT_THE_BUG" />);
    expect(screen.getByText('Spot the Bug')).toBeInTheDocument();
  });

  it('shows hint when showBack is false and hint is provided', () => {
    render(<CardRenderer front="question" cardType="STANDARD" hint="Think about scope" showBack={false} />);
    expect(screen.getByText(/Hint: Think about scope/)).toBeInTheDocument();
  });

  it('hides hint when showBack is true', () => {
    render(<CardRenderer front="question" back="answer" cardType="STANDARD" hint="my hint" showBack={true} />);
    expect(screen.queryByText(/Hint:/)).not.toBeInTheDocument();
  });

  it('shows back content when showBack is true', () => {
    render(<CardRenderer front="question" back="The answer is 42" cardType="STANDARD" showBack={true} />);
    expect(screen.getByText('Answer')).toBeInTheDocument();
    expect(screen.getByText('The answer is 42')).toBeInTheDocument();
  });

  it('does not show back content when showBack is false', () => {
    render(<CardRenderer front="question" back="The answer is 42" cardType="STANDARD" showBack={false} />);
    expect(screen.queryByText('The answer is 42')).not.toBeInTheDocument();
  });
});
