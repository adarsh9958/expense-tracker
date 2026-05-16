import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, LogOut, Menu, X, Moon, Sun, Wallet
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-[#2e2e42] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
  <div className="flex flex-col h-full p-4">
    {/* Logo */}
    <div className="flex items-center gap-3 px-2 py-4 mb-6">
      <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
        <Wallet className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-lg text-gray-900 dark:text-white">ExpenseIQ</span>
    </div>

    {/* Nav */}
    <nav className="flex-1 space-y-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e42]'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* User + logout */}
    <div className="border-t border-gray-200 dark:border-[#2e2e42] pt-4 space-y-2">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  </div>
</aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-[#13131f]">
  {/* Top bar */}
  <header className="sticky top-0 z-30 bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-[#2e2e42] px-4 py-3 flex items-center justify-between lg:px-8">
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2e2e42]"
    >
      <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
    <div className="hidden lg:block" />
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2e2e42] transition-colors"
    >
      {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
    </button>
  </header>

  {/* Page content */}
  <main className="flex-1 p-4 lg:p-8 overflow-auto bg-gray-50 dark:bg-[#13131f]">
    <Outlet />
  </main>
</div>
    </div>
  );
}