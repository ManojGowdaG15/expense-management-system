// src/services/api.js - UPDATED WITH YOUR BACKEND
import axios from 'axios';

// Use your deployed backend URL
const API_BASE_URL = 'https://expense-management-system-ontq.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000, // Increased timeout for Render
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Expense endpoints
export const submitExpense = (data) => API.post('/expenses/submit', data);
export const getMyExpenses = () => API.get('/expenses/my');
export const getAllExpenses = () => API.get('/expenses/all');
export const updateExpenseStatus = (id, data) => API.patch(`/expenses/${id}/status`, data);
export const getDashboard = () => API.get('/expenses/dashboard');