import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiCheckCircle, FiDollarSign, FiArrowUp, FiPlusCircle } from 'react-icons/fi';
import { dashboardAPI } from '../../api/axiosConfig';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getEmployeeDashboard();
      setStats(response.data.dashboard);
      setRecentExpenses(response.data.dashboard.recentExpenses || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const statCards = [
    {
      title: 'Total Expenses',
      value: stats?.totalExpenses || 0,
      icon: <FiFileText />,
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Pending',
      value: stats?.pendingCount || 0,
      icon: <FiClock />,
      color: 'yellow',
      trend: '+3%',
    },
    {
      title: 'Approved',
      value: stats?.approvedCount || 0,
      icon: <FiCheckCircle />,
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'Total Amount',
      value: `₹${(stats?.totalAmount || 0).toLocaleString()}`,
      icon: <FiDollarSign />,
      color: 'purple',
      trend: '+15%',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Employee Dashboard</h1>
        <Link to="/expenses/new" className="btn btn-primary">
          <FiPlusCircle />
          Submit New Expense
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-card-icon ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-trend positive">
                <FiArrowUp />
                {stat.trend}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Expenses</h2>
          <Link to="/expenses" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="card">
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.expenseId}</td>
                      <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                      <td>{expense.category}</td>
                      <td>₹{expense.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${expense.status === 'approved' ? 'success' : 
                                         expense.status === 'rejected' ? 'danger' : 
                                         expense.status === 'reimbursed' ? 'info' : 'warning'}`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiFileText />
              </div>
              <h3 className="empty-state-title">No Expenses Yet</h3>
              <p className="empty-state-text">
                You haven't submitted any expense claims yet.
              </p>
              <Link to="/expenses/new" className="btn btn-primary">
                <FiPlusCircle />
                Submit Your First Expense
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;