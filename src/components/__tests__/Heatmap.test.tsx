import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heatmap } from '../dashboard/Heatmap';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { mockHeatmap } from '../../test/mocks/data';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nProvider>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </I18nProvider>,
  );
}

describe('Heatmap', () => {
  it('renders with mock data', () => {
    renderWithProviders(<Heatmap data={mockHeatmap} />);
    expect(screen.getByText(/Activity/)).toBeInTheDocument();
  });

  it('renders year in title', () => {
    renderWithProviders(<Heatmap data={mockHeatmap} />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    renderWithProviders(<Heatmap data={[]} />);
    expect(screen.getByText(/Activity/)).toBeInTheDocument();
  });

  it('renders grid cells', () => {
    const { container } = renderWithProviders(<Heatmap data={mockHeatmap} />);
    // Look for cells (small colored divs with h-4 w-4 class)
    const cells = container.querySelectorAll('.h-4.w-4');
    expect(cells.length).toBeGreaterThan(0);
  });
});
