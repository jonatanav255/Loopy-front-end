// Dependencies: createContext, useContext, useState, useEffect, useCallback, ReactNode — see DEPENDENCY_GUIDE.md
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeName = 'midnight' | 'ember' | 'ocean' | 'forest' | 'amethyst';

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
    accent: '#6366f1',
    accentHover: '#5457e5',
    accentSubtle: 'rgba(99,102,241,0.2)',
    accentText: '#a5b4fc',
    accentMuted: '#818cf8',
    heatLow: '#166534',
    heatMed: '#16a34a',
    heatHigh: '#22c55e',
    heatMax: '#4ade80',
    swatch: '#6366f1',
  },

  ember: {
    surface: '#2a2229',
    surfaceAlt: '#1a1418',
    surfaceHover: '#3d2f38',
    surfaceActive: '#3d2f38',
    content: '#f0e6e2',
    contentSecondary: '#e1d1cb',
    contentTertiary: '#c9b5ac',
    contentMuted: '#b89e93',
    contentFaint: '#a88a7e',
    line: '#3d2f38',
    lineStrong: '#4d3f48',
    lineSubtle: '#2a2229',
    accent: '#e87b35',
    accentHover: '#d56c28',
    accentSubtle: 'rgba(232,123,53,0.2)',
    accentText: '#fdba74',
    accentMuted: '#f59e0b',
    heatLow: '#7c2d12',
    heatMed: '#c2410c',
    heatHigh: '#ea580c',
    heatMax: '#fb923c',
    swatch: '#e87b35',
  },

  ocean: {
    surface: '#172a3a',
    surfaceAlt: '#0f1923',
    surfaceHover: '#1e3a50',
    surfaceActive: '#1e3a50',
    content: '#e2f0f8',
    contentSecondary: '#bdd8e9',
    contentTertiary: '#9ac0d8',
    contentMuted: '#7aaac4',
    contentFaint: '#6096b4',
    line: '#1e3a50',
    lineStrong: '#265068',
    lineSubtle: '#172a3a',
    accent: '#0891b2',
    accentHover: '#0e7490',
    accentSubtle: 'rgba(8,145,178,0.2)',
    accentText: '#67e8f9',
    accentMuted: '#22d3ee',
    heatLow: '#134e4a',
    heatMed: '#0f766e',
    heatHigh: '#14b8a6',
    heatMax: '#5eead4',
    swatch: '#0891b2',
  },

  forest: {
    surface: '#1e2a20',
    surfaceAlt: '#131a14',
    surfaceHover: '#2a3e2d',
    surfaceActive: '#2a3e2d',
    content: '#e2f0e4',
    contentSecondary: '#c1d8c4',
    contentTertiary: '#a3c0a7',
    contentMuted: '#88aa8d',
    contentFaint: '#729878',
    line: '#2a3e2d',
    lineStrong: '#3a5240',
    lineSubtle: '#1e2a20',
    accent: '#16a34a',
    accentHover: '#15803d',
    accentSubtle: 'rgba(22,163,74,0.2)',
    accentText: '#86efac',
    accentMuted: '#4ade80',
    heatLow: '#365314',
    heatMed: '#65a30d',
    heatHigh: '#84cc16',
    heatMax: '#a3e635',
    swatch: '#16a34a',
  },

  amethyst: {
    surface: '#2a2435',
    surfaceAlt: '#1a1520',
    surfaceHover: '#3d3450',
    surfaceActive: '#3d3450',
    content: '#ede6f5',
    contentSecondary: '#d4c8e2',
    contentTertiary: '#bbaed0',
    contentMuted: '#a395bd',
    contentFaint: '#8e80aa',
    line: '#3d3450',
    lineStrong: '#4d4465',
    lineSubtle: '#2a2435',
    accent: '#9333ea',
    accentHover: '#7e22ce',
    accentSubtle: 'rgba(147,51,234,0.2)',
    accentText: '#d8b4fe',
    accentMuted: '#c084fc',
    heatLow: '#701a75',
    heatMed: '#a21caf',
    heatHigh: '#d946ef',
    heatMax: '#f0abfc',
    swatch: '#9333ea',
  },
};

/** All available theme names in display order */
export const themeNames: ThemeName[] = ['midnight', 'ember', 'ocean', 'forest', 'amethyst'];

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
