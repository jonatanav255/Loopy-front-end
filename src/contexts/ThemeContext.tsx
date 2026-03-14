// Dependencies: createContext, useContext, useState, useEffect, useCallback, ReactNode — see DEPENDENCY_GUIDE.md
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeName = 'midnight' | 'daylight';

export interface ThemeColors {
  surface: string;
  surfaceAlt: string;
  surfaceHover: string;
  surfaceActive: string;
  content: string;
  contentSecondary: string;
  contentTertiary: string;
  contentMuted: string;
  contentFaint: string;
  line: string;
  lineStrong: string;
  lineSubtle: string;
  accent: string;
  accentHover: string;
  accentSubtle: string;
  accentText: string;
  accentMuted: string;
  heatLow: string;
  heatMed: string;
  heatHigh: string;
  heatMax: string;
  /** Small swatch color shown in the theme picker */
  swatch: string;
}

const themes: Record<ThemeName, ThemeColors> = {
  midnight: {
    surface: '#2a2a3c',
    surfaceAlt: '#1a1a2e',
    surfaceHover: '#3a3a50',
    surfaceActive: '#3a3a50',
    content: '#e2e8f0',
    contentSecondary: '#cbd5e1',
    contentTertiary: '#b0b8c9',
    contentMuted: '#94a3b8',
    contentFaint: '#8892a8',
    line: '#3a3a50',
    lineStrong: '#4a4a60',
    lineSubtle: '#2a2a3c',
    accent: '#5457d4',
    accentHover: '#484bc5',
    accentSubtle: 'rgba(84,87,212,0.18)',
    accentText: '#9aa6e8',
    accentMuted: '#6e79e0',
    heatLow: '#12542b',
    heatMed: '#128a3f',
    heatHigh: '#1da650',
    heatMax: '#3fbd6d',
    swatch: '#2a2a3c',
  },

  daylight: {
    surface: '#f8f9fb',
    surfaceAlt: '#ffffff',
    surfaceHover: '#eef0f4',
    surfaceActive: '#e2e5eb',
    content: '#1e293b',
    contentSecondary: '#334155',
    contentTertiary: '#475569',
    contentMuted: '#64748b',
    contentFaint: '#94a3b8',
    line: '#e2e5eb',
    lineStrong: '#cbd5e1',
    lineSubtle: '#f1f3f6',
    accent: '#6366f1',
    accentHover: '#5457e5',
    accentSubtle: 'rgba(99,102,241,0.12)',
    accentText: '#4f46e5',
    accentMuted: '#818cf8',
    heatLow: '#dcfce7',
    heatMed: '#86efac',
    heatHigh: '#22c55e',
    heatMax: '#16a34a',
    swatch: '#f8f9fb',
  },
};

/** All available theme names in display order */
export const themeNames: ThemeName[] = ['midnight', 'daylight'];

interface ThemeContextType {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--surface-alt', colors.surfaceAlt);
  root.style.setProperty('--surface-hover', colors.surfaceHover);
  root.style.setProperty('--surface-active', colors.surfaceActive);
  root.style.setProperty('--content', colors.content);
  root.style.setProperty('--content-secondary', colors.contentSecondary);
  root.style.setProperty('--content-tertiary', colors.contentTertiary);
  root.style.setProperty('--content-muted', colors.contentMuted);
  root.style.setProperty('--content-faint', colors.contentFaint);
  root.style.setProperty('--line', colors.line);
  root.style.setProperty('--line-strong', colors.lineStrong);
  root.style.setProperty('--line-subtle', colors.lineSubtle);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent-hover', colors.accentHover);
  root.style.setProperty('--accent-subtle', colors.accentSubtle);
  root.style.setProperty('--accent-text', colors.accentText);
  root.style.setProperty('--accent-muted', colors.accentMuted);
  root.style.setProperty('--heat-low', colors.heatLow);
  root.style.setProperty('--heat-med', colors.heatMed);
  root.style.setProperty('--heat-high', colors.heatHigh);
  root.style.setProperty('--heat-max', colors.heatMax);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem('loopy-theme') as ThemeName | null;
    return stored && themes[stored] ? stored : 'midnight';
  });

  const colors = themes[theme];

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('loopy-theme', t);
  }, []);

  useEffect(() => {
    applyTheme(colors);
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
