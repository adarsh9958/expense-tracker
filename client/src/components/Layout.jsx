import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowLeftRight, LogOut, Menu, Moon, Sun, Wallet } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen flex"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)'
          : 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f0f4ff 100%)'
      }}>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto
        border-r`}
        style={{
          background: dark
            ? 'rgba(17, 17, 24, 0.95)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.2)',
        }}>
        <div className="flex flex-col h-full p-4">

          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: dark ? '#e2e8f0' : '#1e1b4b' }}>ExpenseIQ</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'active-nav' : 'inactive-nav'}`}
                style={({ isActive }) => isActive ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.15))',
                  color: dark ? '#c4b5fd' : '#7c3aed',
                  boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.3)',
                } : {
                  color: dark ? '#94a3b8' : '#64748b',
                }}>
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="pt-4 space-y-2" style={{ borderTop: `1px solid ${dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.2)'}` }}>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: dark ? '#e2e8f0' : '#1e1b4b' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between lg:px-8"
          style={{
            background: dark ? 'rgba(17,17,24,0.8)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.15)'}`,
          }}>
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: dark ? '#94a3b8' : '#64748b' }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <button onClick={() => setDark(!dark)}
            className="p-2 rounded-lg transition-all"
            style={{
              background: dark ? 'rgba(139,92,246,0.15)' : 'rgba(124,58,237,0.1)',
              color: dark ? '#c4b5fd' : '#7c3aed',
            }}>
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}