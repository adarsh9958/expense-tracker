import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { addTransaction, updateTransaction, deleteTransaction } from '../api/transaction.api';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Filter, X } from 'lucide-react';

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
};

const emptyForm = {
  type: 'expense', amount: '', category: '', description: '',
  date: new Date().toISOString().split('T')[0], paymentMethod: 'cash',
};

export default function Transactions() {
  const { transactions, fetchTransactions, loading, pagination } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search: '', type: '', category: '', page: 1 });

  useEffect(() => {
    fetchTransactions({ ...filters, limit: 10 });
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (t) => {
    setForm({
      type: t.type, amount: t.amount, category: t.category,
      description: t.description || '',
      date: new Date(t.date).toISOString().split('T')[0],
      paymentMethod: t.paymentMethod || 'cash',
    });
    setEditId(t._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) { toast.error('Amount and category are required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateTransaction(editId, form);
        toast.success('Transaction updated');
      } else {
        await addTransaction(form);
        toast.success('Transaction added');
      }
      setShowModal(false);
      fetchTransactions({ ...filters, limit: 10 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
      fetchTransactions({ ...filters, limit: 10 });
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {pagination.total} total transactions
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="input-field pl-9 py-2"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="input-field py-2 w-full sm:w-36"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {(filters.search || filters.type) && (
            <button
              onClick={() => setFilters({ search: '', type: '', category: '', page: 1 })}
              className="btn-ghost flex items-center gap-1 text-sm py-2"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-[#2e2e42] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💸</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Click "Add New" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#2e2e42]">
            {transactions.map((t) => (
              <div key={t._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#2e2e42]/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                    ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                    {getCategoryEmoji(t.category)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.category}</p>
                    <p className="text-xs text-gray-400 truncate">{t.description || '—'} · {formatDate(t.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-semibold ${t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <button onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2e2e42] text-gray-400 hover:text-indigo-500 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-[#2e2e42]">
            <p className="text-sm text-gray-500">Page {pagination.currentPage} of {pagination.totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40"
              >Previous</button>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-[#2e2e42] animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#2e2e42]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2e2e42] text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-[#13131f] rounded-xl">
                {['expense', 'income'].map((t) => (
                  <button key={t} type="button"
                    onClick={() => setForm({ ...form, type: t, category: '' })}
                    className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      form.type === t
                        ? 'bg-white dark:bg-[#1e1e2e] shadow text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >{t}</button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange}
                    placeholder="0.00" min="0.01" step="0.01" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    required className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  required className="input-field">
                  <option value="">Select category</option>
                  {CATEGORIES[form.type].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <input type="text" name="description" value={form.description} onChange={handleChange}
                  placeholder="What was this for?" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
                  className="input-field">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 btn-ghost py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : editId ? 'Update' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
    Health: '💊', Entertainment: '🎬', Education: '📚',
    Salary: '💰', Freelance: '💻', Investment: '📈',
    Gift: '🎁', Other: '💡',
  };
  return map[category] || '💡';
}