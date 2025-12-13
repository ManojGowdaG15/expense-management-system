import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Finance.css';

const Reimbursement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchApprovedExpenses();
  }, []);

  const fetchApprovedExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      // Note: You'll need to create a backend endpoint for approved expenses
      // For now, we'll use mock data
      const mockExpenses = [
        { _id: '1', user: { name: 'John Doe', email: 'john@test.com' }, amount: 250, description: 'Client Lunch', date: '2024-01-15', approvedAt: '2024-01-16' },
        { _id: '2', user: { name: 'Jane Smith', email: 'jane@test.com' }, amount: 150, description: 'Office Supplies', date: '2024-01-14', approvedAt: '2024-01-16' },
        { _id: '3', user: { name: 'Bob Johnson', email: 'bob@test.com' }, amount: 500, description: 'Travel Expense', date: '2024-01-13', approvedAt: '2024-01-15' },
        { _id: '4', user: { name: 'Alice Brown', email: 'alice@test.com' }, amount: 75, description: 'Software Subscription', date: '2024-01-12', approvedAt: '2024-01-14' },
      ];
      setExpenses(mockExpenses);
    } catch (err) {
      setError(err.message || 'Failed to load approved expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExpense = (expenseId) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(exp => exp._id));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedExpenses.length === 0) {
      alert('Please select expenses and an action');
      return;
    }

    if (window.confirm(`Are you sure you want to ${bulkAction} ${selectedExpenses.length} expense(s)?`)) {
      // Process bulk action
      alert(`${bulkAction} action processed for ${selectedExpenses.length} expense(s) (mock action)`);
      setSelectedExpenses([]);
      setBulkAction('');
    }
  };

  const handleReimburseSingle = (expenseId) => {
    if (window.confirm('Mark this expense as reimbursed?')) {
      alert('Expense marked as reimbursed (mock action)');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchApprovedExpenses} />;

  const totalSelectedAmount = expenses
    .filter(exp => selectedExpenses.includes(exp._id))
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="reimbursement-container">
      <div className="page-header">
        <h2>Reimbursement Processing</h2>
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <div className="bulk-header">
          <div className="selection-info">
            <input 
              type="checkbox"
              checked={selectedExpenses.length === expenses.length && expenses.length > 0}
              onChange={handleSelectAll}
              className="bulk-checkbox"
            />
            <span>
              {selectedExpenses.length} expense(s) selected • 
              Total: {formatCurrency(totalSelectedAmount)}
            </span>
          </div>
          
          <div className="bulk-controls">
            <select 
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bulk-select"
            >
              <option value="">Bulk Action</option>
              <option value="reimburse">Mark as Reimbursed</option>
              <option value="export">Export Selected</option>
              <option value="email">Send Payment Notification</option>
            </select>
            
            <button 
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedExpenses.length === 0}
              className="btn-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No approved expenses awaiting reimbursement.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox"
                    checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Employee</th>
                <th>Email</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Expense Date</th>
                <th>Approved On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedExpenses.includes(expense._id)}
                      onChange={() => handleSelectExpense(expense._id)}
                    />
                  </td>
                  <td>{expense.user?.name}</td>
                  <td>{expense.user?.email}</td>
                  <td className="truncate">{expense.description}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{formatDate(expense.approvedAt)}</td>
                  <td>
                    <button 
                      onClick={() => handleReimburseSingle(expense._id)}
                      className="btn-small btn-success"
                    >
                      Mark as Paid
                    </button>
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

export default Reimbursement;
