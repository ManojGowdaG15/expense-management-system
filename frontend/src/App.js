import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Layout from './components/Layout/Layout';

// Auth
import Login from './components/Auth/Login';

// Employee
import EmployeeDashboard from './components/Employee/Dashboard';
import ExpenseList from './components/Employee/ExpenseList';
import SubmitExpense from './components/Employee/SubmitExpense';
import ExpenseDetail from './components/Employee/ExpenseDetail';

// Manager
import ManagerDashboard from './components/Manager/Dashboard';
import PendingExpenses from './components/Manager/PendingExpenses';
import TeamExpenses from './components/Manager/TeamExpenses';

// Finance
import FinanceDashboard from './components/Finance/Dashboard';
import Reimbursement from './components/Finance/Reimbursement';

// Import CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/expenses" element={
            <PrivateRoute allowedRoles={['employee', 'admin']}>
              <Layout>
                <ExpenseList />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/expenses/:id" element={
            <PrivateRoute allowedRoles={['employee', 'manager', 'finance', 'admin']}>
              <Layout>
                <ExpenseDetail />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/submit-expense" element={
            <PrivateRoute allowedRoles={['employee', 'admin']}>
              <Layout>
                <SubmitExpense />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Manager Routes */}
          <Route path="/manager-dashboard" element={
            <PrivateRoute allowedRoles={['manager', 'admin']}>
              <Layout>
                <ManagerDashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/pending-expenses" element={
            <PrivateRoute allowedRoles={['manager', 'finance', 'admin']}>
              <Layout>
                <PendingExpenses />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/team-expenses" element={
            <PrivateRoute allowedRoles={['manager', 'admin']}>
              <Layout>
                <TeamExpenses />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Finance Routes */}
          <Route path="/finance-dashboard" element={
            <PrivateRoute allowedRoles={['finance', 'admin']}>
              <Layout>
                <FinanceDashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/reimbursements" element={
            <PrivateRoute allowedRoles={['finance', 'admin']}>
              <Layout>
                <Reimbursement />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
