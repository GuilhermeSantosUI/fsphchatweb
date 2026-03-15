import { NavLink, Outlet } from 'react-router-dom';

const navItems = [{ to: '/admin', label: 'Dashboard', end: true }];

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-60 shrink-0 bg-gray-900 text-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-lg font-bold tracking-tight">Agnotifica</span>
          <span className="ml-2 text-xs text-gray-400">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
          <h1 className="text-sm font-semibold text-gray-700">
            Painel de administração
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
