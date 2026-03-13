import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { AuthProvider } from '../../contexts/AuthContext';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { RegisterPage } from '../RegisterPage';
import { mockTokens, mockUser } from '../../test/mocks/data';

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<div>Dashboard</div>} />
                <Route path="/login" element={<div>Login Page</div>} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders registration form', () => {
    renderRegisterPage();
    expect(screen.getByText('Loopy')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'different456');
    await user.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.type(screen.getByLabelText('Confirm Password'), 'short');
    await user.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('successful registration redirects to dashboard', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/auth/register', () => {
        return HttpResponse.json(mockTokens);
      }),
      http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
      }),
    );

    renderRegisterPage();

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows link to login page', () => {
    renderRegisterPage();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
