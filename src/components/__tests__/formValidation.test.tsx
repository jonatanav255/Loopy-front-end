import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { TopicForm } from '../topics/TopicForm';
import { ConceptForm } from '../topics/ConceptForm';
import { CardForm } from '../cards/CardForm';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { mockTokens, mockUser } from '../../test/mocks/data';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

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
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('Form Validation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // --- TopicForm ---

  describe('TopicForm', () => {
    it('submit button is disabled when name is empty', () => {
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submit button is enabled when name has text', async () => {
      const user = userEvent.setup();
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'My Topic');

      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    it('submit button is disabled when name is whitespace only', async () => {
      const user = userEvent.setup();
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], '   ');

      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submits successfully with valid name', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<TopicForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Valid Topic');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Valid Topic',
        description: undefined,
        colorHex: '#6366F1',
      });
    });

    it('trims whitespace from name and description before submitting', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<TopicForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], '  Trimmed  ');
      await user.type(inputs[1], '  Some description  ');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Trimmed',
        description: 'Some description',
        colorHex: '#6366F1',
      });
    });

    it('respects name maxLength attribute', () => {
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveAttribute('maxLength', '100');
    });

    it('respects description maxLength attribute', () => {
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[1]).toHaveAttribute('maxLength', '500');
    });

    it('calls onCancel when cancel button clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      renderWithI18n(<TopicForm onSubmit={vi.fn()} onCancel={onCancel} />);

      await user.click(screen.getByText(/Cancel/));
      expect(onCancel).toHaveBeenCalled();
    });

    it('shows Update button when initial data provided', () => {
      const initial = {
        id: 'topic-1',
        name: 'Existing',
        description: 'Desc',
        colorHex: '#EF4444',
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
        cardCount: 0,
      };
      renderWithI18n(
        <TopicForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByText('Update')).toBeInTheDocument();
    });
  });

  // --- ConceptForm ---

  describe('ConceptForm', () => {
    it('submit button is disabled when title is empty', () => {
      renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submit button is enabled when title has text', async () => {
      const user = userEvent.setup();
      renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'My Concept');

      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    it('submit button is disabled when title is whitespace only', async () => {
      const user = userEvent.setup();
      renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], '   ');

      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submits successfully with valid title', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<ConceptForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Valid Concept');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Valid Concept',
        notes: undefined,
        referenceExplanation: undefined,
      });
    });

    it('submits with notes when provided', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<ConceptForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Concept');
      await user.type(inputs[1], 'Some notes');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Concept',
        notes: 'Some notes',
        referenceExplanation: undefined,
      });
    });

    it('respects title maxLength attribute', () => {
      renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveAttribute('maxLength', '200');
    });

    it('shows reference explanation field when editing', () => {
      const initial = {
        id: 'concept-1',
        topicId: 'topic-1',
        title: 'Closures',
        notes: 'Notes here',
        referenceExplanation: null,
        status: 'LEARNING' as const,
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
      };
      renderWithI18n(
        <ConceptForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByText('Reference Explanation')).toBeInTheDocument();
    });

    it('does not show reference explanation field when creating', () => {
      renderWithI18n(<ConceptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      expect(screen.queryByText('Reference Explanation')).not.toBeInTheDocument();
    });
  });

  // --- CardForm ---

  describe('CardForm', () => {
    it('submit button is disabled when front is empty', () => {
      renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submit button is disabled when back is empty', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const textboxes = screen.getAllByRole('textbox');
      await user.type(textboxes[0], 'Question');

      // Back is still empty
      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submit button is disabled when both front and back are empty', () => {
      renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      expect(screen.getByText('Create')).toBeDisabled();
    });

    it('submit button is enabled when both front and back have text', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

      const textboxes = screen.getAllByRole('textbox');
      await user.type(textboxes[0], 'Question?');
      await user.type(textboxes[1], 'Answer.');

      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    it('submits with all fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<CardForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const textboxes = screen.getAllByRole('textbox');
      await user.type(textboxes[0], 'Question?');
      await user.type(textboxes[1], 'Answer.');
      await user.type(textboxes[2], 'Think about it');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        front: 'Question?',
        back: 'Answer.',
        cardType: 'STANDARD',
        hint: 'Think about it',
        sourceUrl: undefined,
      });
    });

    it('card type can be changed', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithI18n(<CardForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'CODE_OUTPUT');

      const textboxes = screen.getAllByRole('textbox');
      await user.type(textboxes[0], 'Code here');
      await user.type(textboxes[1], 'Output');
      await user.click(screen.getByText('Create'));

      expect(onSubmit).toHaveBeenCalledWith({
        front: 'Code here',
        back: 'Output',
        cardType: 'CODE_OUTPUT',
        hint: undefined,
        sourceUrl: undefined,
      });
    });

    it('renders all six card type options', () => {
      renderWithI18n(<CardForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(6);
    });
  });

  // --- LoginPage ---

  describe('LoginPage validation', () => {
    it('renders email and password as required fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
    });

    it('email input has type="email"', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('password input has type="password"', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('successful login redirects to dashboard', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () => HttpResponse.json(mockTokens)),
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
      );

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('shows error message on invalid credentials', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/login', () =>
          HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 }),
        ),
      );

      renderLoginPage();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'wrong');
      await user.click(screen.getByText('Sign in'));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  // --- RegisterPage ---

  describe('RegisterPage validation', () => {
    it('renders all required fields', () => {
      renderRegisterPage();

      expect(screen.getByLabelText('Email')).toBeRequired();
      expect(screen.getByLabelText('Password')).toBeRequired();
      expect(screen.getByLabelText('Confirm Password')).toBeRequired();
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

    it('shows error when password is less than 8 characters', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'short');
      await user.type(screen.getByLabelText('Confirm Password'), 'short');
      await user.click(screen.getByText('Create account'));

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters'),
        ).toBeInTheDocument();
      });
    });

    it('successful registration redirects to dashboard', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/auth/register', () => HttpResponse.json(mockTokens)),
        http.get('/api/auth/me', () => HttpResponse.json(mockUser)),
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

    it('password field has type="password"', () => {
      renderRegisterPage();

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('type', 'password');
    });
  });
});
