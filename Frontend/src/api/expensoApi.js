import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/expenso`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all expenses
export const getAllExpenses = async () => {
  const response = await api.get('');
  return response.data;
};

// Get expense by ID
export const getExpenseById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create a new expense
export const createExpense = async (expense) => {
  const response = await api.post('', expense);
  return response.data;
};

// Update an expense
export const updateExpense = async (id, expense) => {
  const response = await api.put(`/${id}`, expense);
  return response.data;
};

// Delete an expense
export const deleteExpense = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// Get expenses by category
export const getExpensesByCategory = async (category) => {
  const response = await api.get('/byCategory', { params: { category } });
  return response.data;
};

// Get expenses by date range
export const getExpensesByDateRange = async (start, end) => {
  const response = await api.get('/filter', { params: { start, end } });
  return response.data;
};

// Get monthly summary
export const getMonthlySummary = async (month, year) => {
  const response = await api.get('/summary', { params: { month, year } });
  return response.data;
};

export const CATEGORIES = [
  { value: 'Food', label: 'Food', color: '#f59e0b', icon: '🍕' },
  { value: 'Transport', label: 'Transport', color: '#3b82f6', icon: '🚗' },
  { value: 'Shopping', label: 'Shopping', color: '#ec4899', icon: '🛍️' },
  { value: 'Bills', label: 'Bills', color: '#ef4444', icon: '📄' },
  { value: 'Entertainment', label: 'Entertainment', color: '#8b5cf6', icon: '🎮' },
  { value: 'Health', label: 'Health', color: '#10b981', icon: '💊' },
  { value: 'Education', label: 'Education', color: '#06b6d4', icon: '📚' },
  { value: 'Other', label: 'Other', color: '#6b7280', icon: '📌' },
];

export const getCategoryColor = (categoryName) => {
  const cat = CATEGORIES.find(c => c.value.toLowerCase() === categoryName?.toLowerCase());
  return cat ? cat.color : '#6b7280';
};

export const getCategoryIcon = (categoryName) => {
  const cat = CATEGORIES.find(c => c.value.toLowerCase() === categoryName?.toLowerCase());
  return cat ? cat.icon : '📌';
};

export default api;
