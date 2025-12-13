import axios from 'axios';

// This reads from .env.production file
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: API_BASE_URL + '/api',
  withCredentials: true,
  timeout: 30000,
});

// Your API functions...
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const submitExpense = (data) => API.post('/expenses/submit', data);
export const getMyExpenses = () => API.get('/expenses/my');
export const getAllExpenses = () => API.get('/expenses/all');
export const updateExpenseStatus = (id, data) => API.patch(`/expenses/${id}/status`, data);
export const getDashboard = () => API.get('/expenses/dashboard');