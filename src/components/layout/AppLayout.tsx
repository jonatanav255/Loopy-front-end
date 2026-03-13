// Dependencies: Outlet, useNavigate, useState, useCallback — see DEPENDENCY_GUIDE.md
import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { useKeyboard } from '../../hooks/useKeyboard';
import { KeyboardShortcutsHelp } from '../ui/KeyboardShortcutsHelp';

const navRoutes = ['/', '/topics', '/review', '/teach-back', '/ai'];

export function AppLayout() {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleKeyboard = useCallback((key: string, e: KeyboardEvent) => {
    // Alt+1-5 for navigation
    if (e.altKey) {
      const num = parseInt(key);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        navigate(navRoutes[num - 1]);
        return;
      }
    }

    // ? to show shortcuts help
    if (key === '?') {
      setShowShortcuts(prev => !prev);
      return;
    }

    // Escape to close shortcuts help
    if (key === 'Escape' && showShortcuts) {
      setShowShortcuts(false);
    }
  }, [navigate, showShortcuts]);

  useKeyboard(handleKeyboard);

  return (
    <div className="flex h-screen bg-surface-alt">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
      <KeyboardShortcutsHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}
