import { useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight,
  Plus, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

const CATEGORIES = {
  Food: '#f59e0b',
  Transport: '#6366f1',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Health: '#10b981',
  Entertainment: '#8b5cf6',
  Education: '#06b6d4',
  Other: '#94a3b8',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { summary, fetchSummary, transactions, fetchTransactions, loading } = useTransactions();

  useEffect(() => {
    const now = new Date();
    fetchSummary({ month: now.getMonth() + 1, year: now.getFullYear() });
    fetchTransactions({ limit: 5, sortBy: 'date', order: 'desc' });
  }, []);

  // Build monthly chart data from summary
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = (() => {
    if (!summary?.monthlyTrend) return [];
    const map = {};
    summary.monthlyTrend.forEach(({ _id, total }) => {
      const key = `${_id.year}-${_id.month}`;
      if (!map[key]) map[key] = { name: monthNames[_id.month - 1], income: 0, expenses: 0 };
      if (_id.type === 'income') map[key].income = total;
      else map[key].expenses = total;
    });
    return Object.values(map);
  })();

  const pieData = summary?.categoryBreakdown?.slice(0, 6).map((c) => ({
    name: c._id,
    value: c.total,
  })) || [];

  const statCards = [
    {
      label: 'Total Balance',
      value: formatCurrency(summary?.summary?.balance || 0),
      icon: Wallet,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      trend: null,
    },
    {
      label: 'Total Income',
      value: formatCurrency(summary?.summary?.income || 0),
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: 'up',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary?.summary?.expenses || 0),
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-500/10',
      trend: 'down',
    },
    {
      label: 'Transactions',
      value: summary?.summary?.transactionCount || 0,
      icon: ArrowUpRight,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      trend: null,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            Here's your financial summary for this month
          </p>
        </div>
        <Link
          to="/transactions"
          className="btn-primary flex items-center gap-2 text-sm hidden sm:flex"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expenses (6 months)
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e1e2e', border: '1px solid #2e2e42',
                    borderRadius: '12px', color: '#fff', fontSize: '13px'
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#income)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenses)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Add transactions to see your trend" />
          )}
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={CATEGORIES[entry.name] || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e1e2e', border: '1px solid #2e2e42',
                    borderRadius: '12px', color: '#fff', fontSize: '13px'
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Legend iconType="circle" iconSize={8}
                  formatter={(val) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Add expenses to see breakdown" />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <Link to="/transactions"
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-[#2e2e42] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No transactions yet</p>
            <Link to="/transactions" className="btn-primary text-sm mt-3 inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2e2e42] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg
                    ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                    {getCategoryEmoji(t.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.category}</p>
                    <p className="text-xs text-gray-400">{t.description || 'No description'}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function getCategoryEmoji(category) {
  const map = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
    Health: '💊', Entertainment: '🎬', Education: '📚',
    Salary: '💰', Freelance: '💻', Investment: '📈', Other: '💡',
  };
  return map[category] || '💡';
}

function EmptyChart({ message }) {
  return (
    <div className="h-[220px] flex items-center justify-center">
      <p className="text-gray-400 dark:text-gray-500 text-sm">{message}</p>
    </div>
  );
}