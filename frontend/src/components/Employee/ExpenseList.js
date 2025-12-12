import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlusCircle, FiEye, FiTrash2 } from 'react-icons/fi';
import { expenseAPI } from '../../api/axiosConfig';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import ConfirmationModal from '../Common/ConfirmationModal';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expenseId: null });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getExpenses();
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-warning',
      submitted: 'badge-info',
      under_review: 'badge-primary',
      approved: 'badge-success',
      rejected: 'badge-danger',
      reimbursed: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExpenses} />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Expenses</h1>
        <Link to="/expenses/new" className="btn btn-primary">
          <FiPlusCircle />
          Submit New Expense
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Expense Claims</h2>
        </div>
        
        {expenses.length > 0 ? (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
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
                    <td>{expense.expenseId}</td>
                    <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>₹{expense.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/expenses/${expense._id}`} className="btn btn-secondary btn-sm">
                          <FiEye />
                          View
                        </Link>
                        {expense.status === 'draft' && (
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, expenseId: expense._id })}
                            className="btn btn-danger btn-sm"
                          >
                            <FiTrash2 />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiFileText />
            </div>
            <h3 className="empty-state-title">No Expenses Found</h3>
            <p className="empty-state-text">
              You haven't submitted any expense claims yet.
            </p>
            <Link to="/expenses/new" className="btn btn-primary">
              <FiPlusCircle />
              Submit Your First Expense
            </Link>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expenseId: null })}
        onConfirm={() => handleDelete(deleteModal.expenseId)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ExpenseList;