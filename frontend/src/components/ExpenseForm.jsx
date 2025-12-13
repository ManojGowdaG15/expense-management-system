// src/components/ExpenseForm.jsx
import { useState } from 'react';
import { submitExpense } from '../services/api';

export default function ExpenseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Travel',
    expenseDate: '',
    description: '',
    receiptDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitExpense(formData);
      onSuccess();
      // Reset form
      setFormData({
        amount: '',
        category: 'Travel',
        expenseDate: '',
        description: '',
        receiptDetails: ''
      });
    } catch (err) {
      setError('Failed to submit expense. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Submit New Expense</h2>
      {error && <p style={{ color: '#e74c3c', marginBottom: '16px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
          />
        </div>

        <div>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label>Expense Date</label>
          <input
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <label>Receipt/Bill Details (Optional)</label>
          <input
            type="text"
            name="receiptDetails"
            value={formData.receiptDetails}
            onChange={handleChange}
            placeholder="e.g. Bill no. 1234, Hotel XYZ"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Expense'}
        </button>
      </form>
    </div>
  );
}