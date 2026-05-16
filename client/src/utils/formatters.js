import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateInput = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatRelative = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatMonth = (date) => {
  return format(new Date(date), 'MMM yyyy');
};