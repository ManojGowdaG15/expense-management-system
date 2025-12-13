import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Employee.css';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get(`/expenses/${id}`);
      setExpense(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load expense details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  const handleSubmitExpense = async () => {
    if (!window.confirm('Are you sure you want to submit this expense for approval?')) return;
    
    try {
      setSubmitting(true);
      await axiosInstance.post(`/expenses/${id}/submit`);
      fetchExpense(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      navigate('/expenses');
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const downloadReceipt = async () => {
    try {
      const response = await axiosInstance.get(`/expenses/${id}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('No receipt available or failed to download');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExpense} />;
  if (!expense) return <ErrorMessage message="Expense not found" />;

  return (
    <div className="expense-detail-container">
      <div className="detail-header">
        <h2>Expense Details</h2>
        <div className="header-actions">
          <Link to="/expenses" className="btn-secondary">Back to List</Link>
          {expense.status === 'draft' && (
            <>
              <Link to={`/expenses/${id}/edit`} className="btn-primary">Edit</Link>
              <button 
                onClick={handleSubmitExpense}
                className="btn-success"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
              <button 
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(expense.status) }}
            >
              {getStatusLabel(expense.status)}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <label>Description</label>
              <p>{expense.description}</p>
            </div>

            <div className="detail-item">
              <label>Amount</label>
              <p className="amount-large">{formatCurrency(expense.amount)}</p>
            </div>

            <div className="detail-item">
              <label>Category</label>
              <p>{expense.category}</p>
            </div>

            <div className="detail-item">
              <label>Expense Date</label>
              <p>{formatDate(expense.date)}</p>
            </div>

            <div className="detail-item">
              <label>Submitted On</label>
              <p>{expense.submittedAt ? formatDateTime(expense.submittedAt) : 'Not submitted'}</p>
            </div>

            <div className="detail-item">
              <label>Created On</label>
              <p>{formatDateTime(expense.createdAt)}</p>
            </div>

            {expense.receipt && (
              <div className="detail-item full-width">
                <label>Receipt</label>
                <button onClick={downloadReceipt} className="btn-secondary">
                  Download Receipt
                </button>
              </div>
            )}

            {expense.approvedAt && (
              <div className="detail-item">
                <label>Approved On</label>
                <p>{formatDateTime(expense.approvedAt)}</p>
              </div>
            )}

            {expense.approvedBy && (
              <div className="detail-item">
                <label>Approved By</label>
                <p>{expense.approvedBy}</p>
              </div>
            )}

            {expense.rejectionReason && (
              <div className="detail-item full-width">
                <label>Rejection Reason</label>
                <p className="rejection-reason">{expense.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
