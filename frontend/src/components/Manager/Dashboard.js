import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Manager.css';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch pending expenses
      const pendingResponse = await axiosInstance.get('/expenses/pending');
      const pending = pendingResponse.data || [];
      setPendingExpenses(pending.slice(0, 5)); // Show only 5
      
      // Calculate stats
      const pendingAmount = pending.reduce((sum, exp) => sum + exp.amount, 0);
      const pendingCount = pending.length;
      
      setStats({
        pendingAmount,
        pendingCount,
        teamMembers: 8, // Hardcoded for now
        avgApprovalTime: '2.5' // Hardcoded for now
      });
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    try {
      await axiosInstance.put(`/expenses/${expenseId}/approve`);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to approve expense');
    }
  };

  const handleReject = async (expenseId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await axiosInstance.put(`/expenses/${expenseId}/reject`, { reason });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to reject expense');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>Pending Approval</h3>
            <p className="stat-value">{stats.pendingCount}</p>
            <p className="stat-count">expenses</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon amount">💰</div>
          <div className="stat-info">
            <h3>Pending Amount</h3>
            <p className="stat-value">{formatCurrency(stats.pendingAmount)}</p>
            <p className="stat-count">awaiting approval</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon team">👥</div>
          <div className="stat-info">
            <h3>Team Members</h3>
            <p className="stat-value">{stats.teamMembers}</p>
            <p className="stat-count">in your team</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon time">⏱️</div>
          <div className="stat-info">
            <h3>Avg. Approval Time</h3>
            <p className="stat-value">{stats.avgApprovalTime}d</p>
            <p className="stat-count">days</p>
          </div>
        </div>
      </div>
      
      {/* Pending Expenses */}
      <div className="pending-expenses-section">
        <div className="section-header">
          <h3>Pending Expenses</h3>
          <Link to="/pending-expenses" className="btn-link">View All</Link>
        </div>
        
        {pendingExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No pending expenses to review.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.user?.name || 'Unknown'}</td>
                    <td className="truncate">{expense.description}</td>
                    <td>{expense.category}</td>
                    <td className="amount">{formatCurrency(expense.amount)}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/expenses/${expense._id}`} className="btn-small">
                          View
                        </Link>
                        <button 
                          onClick={() => handleApprove(expense._id)}
                          className="btn-small btn-success"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(expense._id)}
                          className="btn-small btn-danger"
                        >
                          Reject
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
          <Link to="/pending-expenses" className="action-card">
            <div className="action-icon">⏳</div>
            <div className="action-text">Review Pending</div>
          </Link>
          <Link to="/team-expenses" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-text">Team Expenses</div>
          </Link>
          <div className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-text">Team Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
