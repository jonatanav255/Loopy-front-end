import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { ReactElement, ReactNode } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

/** Wraps children with all app-level providers for testing. */
function AllProviders({ children, initialEntries }: { children: ReactNode; initialEntries?: string[] }) {
  return (
    <MemoryRouter initialEntries={initialEntries ?? ['/']}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>
  );
}

/** Custom render that wraps component with all providers (Auth, Toast, I18n, Theme, Router). */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const { initialEntries, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

/** Wraps hook with all providers for renderHook tests. */
export function createWrapper(initialEntries?: string[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AllProviders initialEntries={initialEntries}>{children}</AllProviders>;
  };
}
