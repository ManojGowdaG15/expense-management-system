import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  getProfile: () => axiosInstance.get('/auth/profile'),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const expenseAPI = {
  // Employee endpoints
  getExpenses: (params) => axiosInstance.get('/expenses', { params }),
  
  getExpenseById: (id) => axiosInstance.get(`/expenses/${id}`),
  
  createExpense: (data) => 
    axiosInstance.post('/expenses', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  submitExpense: (id) => axiosInstance.post(`/expenses/${id}/submit`),
  
  deleteExpense: (id) => axiosInstance.delete(`/expenses/${id}`),
  
  // Manager endpoints
  getPendingExpenses: () => axiosInstance.get('/expenses/pending'),
  
  approveExpense: (id, comments) =>
    axiosInstance.put(`/expenses/${id}/approve`, { comments }),
  
  rejectExpense: (id, reason) =>
    axiosInstance.put(`/expenses/${id}/reject`, { reason }),
  
  // Finance endpoints
  getFinanceReports: () => axiosInstance.get('/expenses/manager/reports'),
};

export const dashboardAPI = {
  getEmployeeDashboard: () => axiosInstance.get('/dashboard/employee'),
  
  getManagerDashboard: () => axiosInstance.get('/dashboard/manager'),
  
  getFinanceDashboard: () => axiosInstance.get('/dashboard/finance'),
};

export default axiosInstance;