// Dependencies: Outlet, useNavigate, useState, useCallback — see DEPENDENCY_GUIDE.md
import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useTheme, themeNames } from '../../contexts/ThemeContext';
import { KeyboardShortcutsHelp } from '../ui/KeyboardShortcutsHelp';

// Shift+1-5 produces !, @, #, $, % on US keyboards
const shiftNavKeys: Record<string, string> = {
  '!': '/',
  '@': '/topics',
  '#': '/review',
  '$': '/teach-back',
  '%': '/ai',
  '^': '/search',
  '&': '/data',
};

export function AppLayout() {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleKeyboard = useCallback((key: string, e: KeyboardEvent) => {
    // Shift+letter for navigation
    if (e.shiftKey && shiftNavKeys[key]) {
      navigate(shiftNavKeys[key]);
      return;
    }

    // ? to show shortcuts help
    if (key === '?') {
      setShowShortcuts(prev => !prev);
      return;
    }

    // Escape to close shortcuts help
    if (key === 'Escape' && showShortcuts) {
      setShowShortcuts(false);
      return;
    }

    // T to cycle through themes
    if (key === 't' || key === 'T') {
      const currentIndex = themeNames.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themeNames.length;
      setTheme(themeNames[nextIndex]);
    }
  }, [navigate, showShortcuts, theme, setTheme]);

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
