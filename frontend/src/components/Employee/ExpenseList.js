import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import ConfirmationModal from '../Common/ConfirmationModal';
import './Employee.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expenseId: null });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/expenses');
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axiosInstance.delete(`/expenses/${expenseId}`);
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
      setDeleteModal({ isOpen: false, expenseId: null });
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const handleSubmitExpense = async (expenseId) => {
    try {
      await axiosInstance.post(`/expenses/${expenseId}/submit`);
      fetchExpenses(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to submit expense');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h2>My Expenses</h2>
        <Link to="/submit-expense" className="btn-primary">
          + New Expense
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchExpenses} />}

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Create your first expense!</p>
          <Link to="/submit-expense" className="btn-primary">Submit Expense</Link>
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
              {expenses.map((expense) => (
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
                    <div className="action-buttons">
                      <Link to={`/expenses/${expense._id}`} className="btn-small">
                        View
                      </Link>
                      {expense.status === 'draft' && (
                        <>
                          <Link to={`/expenses/${expense._id}/edit`} className="btn-small btn-edit">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleSubmitExpense(expense._id)}
                            className="btn-small btn-submit"
                          >
                            Submit
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, expenseId: expense._id })}
                            className="btn-small btn-delete"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expenseId: null })}
        onConfirm={() => handleDelete(deleteModal.expenseId)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ExpenseList;
