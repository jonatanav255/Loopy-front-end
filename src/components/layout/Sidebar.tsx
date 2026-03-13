// Dependencies: NavLink — see DEPENDENCY_GUIDE.md
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../contexts/I18nContext';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useI18n();

  const navItems = [
    { to: '/', label: t.nav.dashboard, icon: '□', shortcut: '⇧D' },
    { to: '/topics', label: t.nav.topics, icon: '▦', shortcut: '⇧T' },
    { to: '/review', label: t.nav.review, icon: '↻', shortcut: '⇧R' },
    { to: '/teach-back', label: t.nav.teachBack, icon: '✎', shortcut: '⇧B' },
    { to: '/ai', label: t.nav.ai, icon: '◇', shortcut: '⇧A' },
  ];

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-5">
        <h1 className="text-xl font-bold text-indigo-400">{t.appName}</h1>
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
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-content-secondary hover:bg-surface-hover'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            <span className="text-[10px] text-content-faint opacity-60">{item.shortcut}</span>
          </NavLink>
        ))}
      </nav>

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
