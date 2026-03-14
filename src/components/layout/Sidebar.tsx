// Dependencies: NavLink — see DEPENDENCY_GUIDE.md
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme, themeNames, type ThemeName } from '../../contexts/ThemeContext';

const themeLabels: Record<ThemeName, string> = {
  midnight: 'Dark',
  daylight: 'Light',
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useI18n();
  const { theme, colors, setTheme } = useTheme();

  const navItems = [
    { to: '/', label: t.nav.dashboard, icon: '□', shortcut: '⇧1' },
    { to: '/topics', label: t.nav.topics, icon: '▦', shortcut: '⇧2' },
    { to: '/review', label: t.nav.review, icon: '↻', shortcut: '⇧3' },
    { to: '/teach-back', label: t.nav.teachBack, icon: '✎', shortcut: '⇧4' },
    { to: '/ai', label: t.nav.ai, icon: '◇', shortcut: '⇧5' },
    { to: '/search', label: t.nav.search, icon: '⌕', shortcut: '⇧6' },
    { to: '/data', label: t.nav.dataport, icon: '⇄', shortcut: '⇧7' },
  ];

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-5">
        <h1 className="text-xl font-bold text-primary-text">{t.appName}</h1>
        <button
          onClick={toggleLang}
          className="rounded border border-line-strong px-2 py-0.5 text-xs font-medium text-content-secondary hover:bg-surface-hover"
          title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
          {lang === 'en' ? t.language.es : t.language.en}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={e => (e.currentTarget as HTMLElement).blur()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-subtle text-primary-text'
                  : 'text-content hover:bg-surface-hover'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            <span className="text-[10px] text-content-muted">{item.shortcut}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme switcher */}
      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center gap-3">
          {themeNames.map(name => (
            <button
              key={name}
              onClick={() => setTheme(name)}
              title={themeLabels[name]}
              className={`group relative h-7 w-7 rounded-full transition-all ${
                theme === name
                  ? 'ring-2 ring-content ring-offset-2 ring-offset-surface'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: colors.swatch !== undefined && theme === name ? colors.swatch : undefined }}
            >
              <span
                className="absolute inset-0 rounded-full border border-line-strong"
                style={{ backgroundColor: themeSwatches[name] }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line-strong p-4">
        <p className="truncate text-sm text-content mb-2">{user?.email}</p>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          {t.nav.signOut}
        </button>
      </div>
    </aside>
  );
}

/** Static swatch colors for each theme (not dependent on active theme) */
const themeSwatches: Record<ThemeName, string> = {
  midnight: '#2a2a3c',
  daylight: '#f8f9fb',
};
