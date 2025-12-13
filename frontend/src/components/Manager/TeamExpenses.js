import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Manager.css';

const TeamExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTeamExpenses();
  }, []);

  const fetchTeamExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      // Note: You'll need to create a backend endpoint for team expenses
      // For now, using pending expenses endpoint
      const response = await axiosInstance.get('/expenses/pending');
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load team expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.status && expense.status !== filters.status) return false;
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) return false;
    return true;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTeamExpenses} />;

  return (
    <div className="team-expenses-container">
      <div className="page-header">
        <h2>Team Expenses</h2>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Status</label>
            <select 
              name="status" 
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="submitted">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category</label>
            <select 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>From Date</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label>To Date</label>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value">{filteredExpenses.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Amount</div>
          <div className="summary-value">
            {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Avg. Amount</div>
          <div className="summary-value">
            {formatCurrency(filteredExpenses.length > 0 ? 
              filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / filteredExpenses.length : 0
            )}
          </div>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found matching your filters.</p>
          <button 
            onClick={() => setFilters({ status: '', category: '', startDate: '', endDate: '' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.user?.name || 'Unknown'}</td>
                  <td className="truncate">{expense.description}</td>
                  <td>{expense.category}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(expense.status) }}
                    >
                      {getStatusLabel(expense.status)}
                    </span>
                  </td>
                  <td>
                    <a href={`/expenses/${expense._id}`} className="btn-small">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamExpenses;
