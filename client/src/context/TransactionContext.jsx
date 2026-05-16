import { createContext, useContext, useState, useCallback } from 'react';
import { getTransactions, getSummary } from '../api/transaction.api';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getTransactions(params);
      setTransactions(res.data.transactions);
      setPagination({
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (params = {}) => {
    try {
      const res = await getSummary(params);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <TransactionContext.Provider
      value={{ transactions, summary, loading, pagination, fetchTransactions, fetchSummary, setTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
};