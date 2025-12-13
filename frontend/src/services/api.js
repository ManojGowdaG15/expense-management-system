// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-management-system-ontq.onrender.com', // ← REPLACE WITH YOUR RENDER URL
  withCredentials: true
});

export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const submitExpense = (data) => API.post('/expenses/submit', data);
export const getMyExpenses = () => API.get('/expenses/my');
export const getAllExpenses = () => API.get('/expenses/all');
export const updateExpenseStatus = (id, data) => API.patch(`/expenses/${id}/status`, data);
export const getDashboard = () => API.get('/expenses/dashboard');