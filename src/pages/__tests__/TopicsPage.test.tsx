import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { I18nProvider } from '../../contexts/I18nContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { TopicsPage } from '../TopicsPage';
import { mockTopics } from '../../test/mocks/data';

function renderTopicsPage() {
  return render(
    <MemoryRouter>
      <I18nProvider>
        <ThemeProvider>
          <ToastProvider>
            <TopicsPage />
          </ToastProvider>
        </ThemeProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe('TopicsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders topic list', async () => {
    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  it('shows topic creation form when New Topic button is clicked', async () => {
    const user = userEvent.setup();
    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    await user.click(screen.getByText(/New Topic/));
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('creates a new topic', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/topics', () => {
        return HttpResponse.json({
          id: 'topic-new',
          name: 'Python',
          description: '',
          colorHex: '#6366F1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cardCount: 0,
        }, { status: 201 });
      }),
    );

    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    await user.click(screen.getByText(/New Topic/));

    // The TopicForm uses a plain <input> with autoFocus — find it via the first text input
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0]; // First textbox is the name field
    await user.type(nameInput, 'Python');
    await user.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('Topic created')).toBeInTheDocument();
    });
  });

  it('shows empty state when no topics', async () => {
    server.use(
      http.get('/api/topics', () => {
        return HttpResponse.json([]);
      }),
    );

    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('No topics yet')).toBeInTheDocument();
    });
  });

  it('delete topic shows confirmation dialog', async () => {
    const user = userEvent.setup();
    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Delete topic?')).toBeInTheDocument();
    expect(screen.getByText(/permanently delete/)).toBeInTheDocument();
  });

  it('confirming delete removes topic', async () => {
    const user = userEvent.setup();

    let deleted = false;
    server.use(
      http.get('/api/topics', () => {
        return HttpResponse.json(deleted ? [mockTopics[1]] : mockTopics);
      }),
      http.delete('/api/topics/:id', () => {
        deleted = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderTopicsPage();

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Topic deleted')).toBeInTheDocument();
    });
  });
});
