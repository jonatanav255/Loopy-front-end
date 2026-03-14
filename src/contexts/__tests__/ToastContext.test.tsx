import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.toasts).toEqual([]);
  });

  it('addToast adds a toast with default type info', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Hello');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Hello');
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('addToast supports success type', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Saved!', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('addToast supports error type', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Something went wrong', 'error');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
  });

  it('removeToast removes a specific toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('First');
      result.current.addToast('Second');
    });

    expect(result.current.toasts).toHaveLength(2);

    const firstId = result.current.toasts[0].id;
    act(() => {
      result.current.removeToast(firstId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Second');
  });

  it('multiple toasts can be added', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('First', 'info');
      result.current.addToast('Second', 'success');
      result.current.addToast('Third', 'error');
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].message).toBe('First');
    expect(result.current.toasts[1].message).toBe('Second');
    expect(result.current.toasts[2].message).toBe('Third');
  });

  it('auto-dismisses toast after 3000ms', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Auto-dismiss me');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('does not dismiss toast before 3000ms', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Still here');
    });

    act(() => {
      vi.advanceTimersByTime(2999);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('renders toast messages in the DOM', () => {
    function TestComponent() {
      const { addToast } = useToast();
      return (
        <button onClick={() => addToast('Visible toast', 'success')}>
          Show Toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = screen.getByText('Show Toast');
    act(() => {
      button.click();
    });

    expect(screen.getByText('Visible toast')).toBeInTheDocument();
  });

  it('clicking a toast removes it', () => {
    function TestComponent() {
      const { addToast } = useToast();
      return (
        <button onClick={() => addToast('Click me to dismiss')}>
          Show Toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = screen.getByText('Show Toast');
    act(() => {
      fireEvent.click(button);
    });

    const toast = screen.getByText('Click me to dismiss');
    expect(toast).toBeInTheDocument();

    act(() => {
      fireEvent.click(toast);
    });

    expect(screen.queryByText('Click me to dismiss')).not.toBeInTheDocument();
  });

  it('each toast has a unique id', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('First');
      result.current.addToast('Second');
      result.current.addToast('Third');
    });

    const ids = result.current.toasts.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });
});
