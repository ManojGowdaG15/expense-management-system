import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { 
  MoneyIcon, 
  ClockIcon, 
  CheckIcon, 
  CrossIcon, 
  AddExpenseIcon, 
  FileIcon, 
  ChartIcon 
} from '../Common/Icons';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Employee.css';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalAmount: 0,
    pendingCount: 0,
    approvedAmount: 0,
    rejectedCount: 0,
    totalCount: 0
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch expenses for stats
      const expensesResponse = await axiosInstance.get('/expenses');
      const expenses = expensesResponse.data || [];
      
      // Calculate stats
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const pendingCount = expenses.filter(exp => exp.status === 'submitted').length;
      const approvedAmount = expenses
        .filter(exp => exp.status === 'approved' || exp.status === 'reimbursed')
        .reduce((sum, exp) => sum + exp.amount, 0);
      const rejectedCount = expenses.filter(exp => exp.status === 'rejected').length;
      
      setStats({
        totalAmount,
        pendingCount,
        approvedAmount,
        rejectedCount,
        totalCount: expenses.length
      });
      
      // Get recent expenses (last 5)
      const recent = expenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentExpenses(recent);
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/submit-expense" className="btn-primary">
          <AddExpenseIcon size={16} />
          <span>New Expense</span>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <MoneyIcon size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p className="stat-value">{formatCurrency(stats.totalAmount)}</p>
            <p className="stat-count">{stats.totalCount} expenses</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <ClockIcon size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingCount}</p>
            <p className="stat-count">awaiting approval</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <CheckIcon size={24} />
          </div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p className="stat-value">{formatCurrency(stats.approvedAmount)}</p>
            <p className="stat-count">approved amount</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <CrossIcon size={24} />
          </div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p className="stat-value">{stats.rejectedCount}</p>
            <p className="stat-count">expenses</p>
          </div>
        </div>
      </div>
      
      {/* Recent Expenses */}
      <div className="recent-expenses">
        <div className="section-header">
          <h3>Recent Expenses</h3>
          <Link to="/expenses" className="btn-link">
            <FileIcon size={16} />
            <span>View All</span>
          </Link>
        </div>
        
        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet. Create your first expense!</p>
            <Link to="/submit-expense" className="btn-primary">
              <AddExpenseIcon size={16} />
              <span>Submit Expense</span>
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{formatDate(expense.date)}</td>
                    <td className="truncate">{expense.description}</td>
                    <td>{expense.category}</td>
                    <td className="amount">{formatCurrency(expense.amount)}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(expense.status) }}
                      >
                        {getStatusLabel(expense.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/expenses/${expense._id}`} className="btn-small">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/submit-expense" className="action-card">
            <div className="action-icon">
              <AddExpenseIcon size={32} />
            </div>
            <div className="action-text">Submit New Expense</div>
          </Link>
          <Link to="/expenses" className="action-card">
            <div className="action-icon">
              <FileIcon size={32} />
            </div>
            <div className="action-text">View All Expenses</div>
          </Link>
          <div className="action-card">
            <div className="action-icon">
              <ChartIcon size={32} />
            </div>
            <div className="action-text">Expense Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;