import API from './axios';

export const getTransactions = (params) => API.get('/transactions', { params });
export const getSummary = (params) => API.get('/transactions/summary', { params });
export const addTransaction = (data) => API.post('/transactions', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);