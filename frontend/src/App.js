import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';

// Employee Components
import EmployeeDashboard from './components/Employee/Dashboard';
import ExpenseList from './components/Employee/ExpenseList';
import SubmitExpense from './components/Employee/SubmitExpense';
import ExpenseDetail from './components/Employee/ExpenseDetail';

// Manager Components
import ManagerDashboard from './components/Manager/Dashboard';
import PendingExpenses from './components/Manager/PendingExpenses';
import TeamExpenses from './components/Manager/TeamExpenses';

// Finance Components
import FinanceDashboard from './components/Finance/Dashboard';
import Reimbursement from './components/Finance/Reimbursement';

import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            {/* Employee Routes */}
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={
              <PrivateRoute allowedRoles={['employee', 'manager', 'finance', 'admin']}>
                <EmployeeDashboard />
              </PrivateRoute>
            } />
            
            <Route path="expenses" element={
              <PrivateRoute allowedRoles={['employee']}>
                <ExpenseList />
              </PrivateRoute>
            } />
            
            <Route path="expenses/new" element={
              <PrivateRoute allowedRoles={['employee']}>
                <SubmitExpense />
              </PrivateRoute>
            } />
            
            <Route path="expenses/:id" element={
              <PrivateRoute allowedRoles={['employee']}>
                <ExpenseDetail />
              </PrivateRoute>
            } />
            
            {/* Manager Routes */}
            <Route path="manager/dashboard" element={
              <PrivateRoute allowedRoles={['manager', 'admin']}>
                <ManagerDashboard />
              </PrivateRoute>
            } />
            
            <Route path="expenses/pending" element={
              <PrivateRoute allowedRoles={['manager', 'admin']}>
                <PendingExpenses />
              </PrivateRoute>
            } />
            
            <Route path="expenses/team" element={
              <PrivateRoute allowedRoles={['manager', 'admin']}>
                <TeamExpenses />
              </PrivateRoute>
            } />
            
            {/* Finance Routes */}
            <Route path="finance/dashboard" element={
              <PrivateRoute allowedRoles={['finance', 'admin']}>
                <FinanceDashboard />
              </PrivateRoute>
            } />
            
            <Route path="expenses/reimbursements" element={
              <PrivateRoute allowedRoles={['finance', 'admin']}>
                <Reimbursement />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;