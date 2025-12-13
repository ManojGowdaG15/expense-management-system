import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import ErrorMessage from '../Common/ErrorMessage';
import './Employee.css';

const SubmitExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    receipt: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      receipt: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('amount', parseFloat(formData.amount));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('date', formData.date);
      if (formData.receipt) {
        formDataToSend.append('receipt', formData.receipt);
      }

      const response = await axiosInstance.post('/expenses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        alert('Expense submitted successfully!');
        navigate('/expenses');
      } else {
        setError(response.message || 'Failed to submit expense');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-expense-container">
      <div className="page-header">
        <h2>Submit Expense</h2>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
            disabled={loading}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount (USD) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="receipt">Receipt (Optional)</label>
            <input
              type="file"
              id="receipt"
              name="receipt"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={loading}
            />
            <small className="file-hint">
              Accepted: JPG, PNG, PDF (Max 5MB)
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/expenses')}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitExpense;
