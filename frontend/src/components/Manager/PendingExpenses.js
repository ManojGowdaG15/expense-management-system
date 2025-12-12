import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import { expenseAPI } from '../../api/axiosConfig';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import ConfirmationModal from '../Common/ConfirmationModal';
import toast from 'react-hot-toast';

const PendingExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: '',
    expenseId: null,
    expenseAmount: 0,
    comments: ''
  });

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getPendingExpenses();
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pending expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await expenseAPI.approveExpense(actionModal.expenseId, actionModal.comments);
      toast.success('Expense approved successfully!');
      fetchPendingExpenses();
      setActionModal({ isOpen: false, type: '', expenseId: null, comments: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to approve expense');
    }
  };

  const handleReject = async () => {
    if (!actionModal.comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      await expenseAPI.rejectExpense(actionModal.expenseId, actionModal.comments);
      toast.success('Expense rejected successfully!');
      fetchPendingExpenses();
      setActionModal({ isOpen: false, type: '', expenseId: null, comments: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to reject expense');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPendingExpenses} />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Pending Approvals</h1>
        <div className="text-sm text-gray-600">
          Total Pending: {expenses.length}
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="card">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Expense ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      <div>
                        <div className="font-medium">{expense.userId?.name}</div>
                        <div className="text-sm text-gray-500">{expense.userId?.department}</div>
                      </div>
                    </td>
                    <td>{expense.expenseId}</td>
                    <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>₹{expense.amount.toLocaleString()}</td>
                    <td>{expense.category}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActionModal({
                            isOpen: true,
                            type: 'approve',
                            expenseId: expense._id,
                            expenseAmount: expense.amount,
                            comments: 'Approved as per policy'
                          })}
                          className="btn btn-success btn-sm"
                        >
                          <FiCheckCircle />
                          Approve
                        </button>
                        <button
                          onClick={() => setActionModal({
                            isOpen: true,
                            type: 'reject',
                            expenseId: expense._id,
                            expenseAmount: expense.amount,
                            comments: ''
                          })}
                          className="btn btn-danger btn-sm"
                        >
                          <FiXCircle />
                          Reject
                        </button>
                      </div>
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
              <FiCheckCircle />
            </div>
            <h3 className="empty-state-title">No Pending Approvals</h3>
            <p className="empty-state-text">
              All expense claims have been processed.
            </p>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: '', expenseId: null, comments: '' })}
        onConfirm={actionModal.type === 'approve' ? handleApprove : handleReject}
        title={actionModal.type === 'approve' ? 'Approve Expense' : 'Reject Expense'}
        message={
          actionModal.type === 'approve'
            ? `Are you sure you want to approve this expense of ₹${actionModal.expenseAmount}?`
            : `Are you sure you want to reject this expense of ₹${actionModal.expenseAmount}?`
        }
        confirmText={actionModal.type === 'approve' ? 'Approve' : 'Reject'}
        type={actionModal.type === 'approve' ? 'info' : 'danger'}
      />

      {actionModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-lg font-semibold">
                {actionModal.type === 'approve' ? 'Approve Expense' : 'Reject Expense'}
              </h2>
              <button
                onClick={() => setActionModal({ isOpen: false, type: '', expenseId: null, comments: '' })}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  {actionModal.type === 'approve' ? 'Approval Comments (Optional)' : 'Reason for Rejection *'}
                </label>
                <textarea
                  value={actionModal.comments}
                  onChange={(e) => setActionModal(prev => ({ ...prev, comments: e.target.value }))}
                  className="textarea"
                  placeholder={
                    actionModal.type === 'approve' 
                      ? 'Add comments if any...' 
                      : 'Please provide a reason for rejection...'
                  }
                  rows="3"
                  required={actionModal.type === 'reject'}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setActionModal({ isOpen: false, type: '', expenseId: null, comments: '' })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={actionModal.type === 'approve' ? handleApprove : handleReject}
                className={`btn ${actionModal.type === 'approve' ? 'btn-success' : 'btn-danger'}`}
                disabled={actionModal.type === 'reject' && !actionModal.comments.trim()}
              >
                {actionModal.type === 'approve' ? 'Approve Expense' : 'Reject Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingExpenses;