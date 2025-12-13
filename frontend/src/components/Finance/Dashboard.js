import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Finance.css';

const FinanceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApproved, setRecentApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // These are mock stats - you'll need to create backend endpoints
      const mockStats = {
        totalApproved: 12500,
        pendingReimbursement: 8500,
        processedThisMonth: 4200,
        avgProcessingTime: '3.2'
      };
      
      setStats(mockStats);
      
      // Mock recent approved expenses
      const mockRecent = [
        { _id: '1', user: { name: 'John Doe' }, amount: 250, description: 'Client Lunch', date: '2024-01-15' },
        { _id: '2', user: { name: 'Jane Smith' }, amount: 150, description: 'Office Supplies', date: '2024-01-14' },
        { _id: '3', user: { name: 'Bob Johnson' }, amount: 500, description: 'Travel Expense', date: '2024-01-13' },
      ];
      setRecentApproved(mockRecent);
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReimburse = async (expenseId) => {
    if (!window.confirm('Mark this expense as reimbursed?')) return;
    
    try {
      // You'll need to create a reimbursement endpoint
      alert('Expense marked as reimbursed (mock action)');
    } catch (err) {
      alert(err.message || 'Failed to process reimbursement');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="finance-dashboard">
      <div className="dashboard-header">
        <h2>Finance Dashboard</h2>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">💰</div>
          <div className="stat-info">
            <h3>Total Approved</h3>
            <p className="stat-value">{formatCurrency(stats.totalApproved)}</p>
            <p className="stat-count">all time</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>Pending Reimbursement</h3>
            <p className="stat-value">{formatCurrency(stats.pendingReimbursement)}</p>
            <p className="stat-count">awaiting payment</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon processed">✅</div>
          <div className="stat-info">
            <h3>Processed This Month</h3>
            <p className="stat-value">{formatCurrency(stats.processedThisMonth)}</p>
            <p className="stat-count">January 2024</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon time">⏱️</div>
          <div className="stat-info">
            <h3>Avg. Processing Time</h3>
            <p className="stat-value">{stats.avgProcessingTime}d</p>
            <p className="stat-count">days</p>
          </div>
        </div>
      </div>
      
      {/* Recent Approved Expenses */}
      <div className="recent-section">
        <div className="section-header">
          <h3>Recently Approved</h3>
          <Link to="/reimbursements" className="btn-link">View All</Link>
        </div>
        
        {recentApproved.length === 0 ? (
          <div className="empty-state">
            <p>No recently approved expenses.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Approved On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApproved.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.user?.name}</td>
                    <td className="truncate">{expense.description}</td>
                    <td className="amount">{formatCurrency(expense.amount)}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleReimburse(expense._id)}
                          className="btn-small btn-success"
                        >
                          Mark as Paid
                        </button>
                      </div>
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
          <Link to="/reimbursements" className="action-card">
            <div className="action-icon">💳</div>
            <div className="action-text">Process Reimbursements</div>
          </Link>
          <Link to="/reports" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-text">Generate Reports</div>
          </Link>
          <div className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-text">Budget Overview</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
