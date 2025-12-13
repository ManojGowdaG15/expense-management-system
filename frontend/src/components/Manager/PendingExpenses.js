import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Manager.css';

const PendingExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/expenses/pending');
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pending expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    try {
      await axiosInstance.put(`/expenses/${expenseId}/approve`);
      fetchPendingExpenses(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to approve expense');
    }
  };

  const handleReject = async (expenseId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await axiosInstance.put(`/expenses/${expenseId}/reject`, { reason });
      fetchPendingExpenses(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to reject expense');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPendingExpenses} />;

  return (
    <div className="pending-expenses-container">
      <div className="page-header">
        <h2>Pending Expenses</h2>
        <div className="stats-summary">
          <span className="stat-item">
            <strong>{expenses.length}</strong> pending expenses
          </span>
          <span className="stat-item">
            <strong>{formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}</strong> total amount
          </span>
        </div>
      </div>

      {expenses.length === 0 ? (
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
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.user?.name || 'Unknown'}</td>
                  <td className="truncate">{expense.description}</td>
                  <td>{expense.category}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{formatDate(expense.submittedAt)}</td>
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
  );
};

export default PendingExpenses;
