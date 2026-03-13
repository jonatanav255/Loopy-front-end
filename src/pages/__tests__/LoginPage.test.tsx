import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { AuthProvider } from '../../contexts/AuthContext';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { LoginPage } from '../LoginPage';
import { mockTokens, mockUser } from '../../test/mocks/data';

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<div>Dashboard</div>} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders login form', () => {
    renderLoginPage();
    expect(screen.getByText('Loopy')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders remember me checkbox', () => {
    renderLoginPage();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('submits login form and redirects on success', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json(mockTokens);
      }),
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays error on failed login', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }),
    );

    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });
  });

  it('shows link to register page', () => {
    renderLoginPage();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('remember me checkbox is functional', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const checkbox = screen.getByRole('checkbox');
    // Default is unchecked (no remembered email in localStorage)
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
