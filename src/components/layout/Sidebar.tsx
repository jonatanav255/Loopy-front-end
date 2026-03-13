// Dependencies: NavLink — see DEPENDENCY_GUIDE.md
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '□' },
  { to: '/topics', label: 'Topics', icon: '▦' },
  { to: '/review', label: 'Review', icon: '↻' },
  { to: '/teach-back', label: 'Teach-Back', icon: '✎' },
  { to: '/ai', label: 'AI', icon: '◇' },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-5">
        <h1 className="text-xl font-bold text-indigo-600">Loopy</h1>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="truncate text-sm text-gray-600">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
