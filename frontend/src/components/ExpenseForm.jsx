// src/components/ExpenseForm.jsx - UPDATED
import { useState } from 'react';
import { submitExpense } from '../services/api';
import { 
  FaPaperPlane, 
  FaMoneyBillWave,
  FaTag,
  FaCalendar,
  FaFileAlt,
  FaReceipt
} from 'react-icons/fa';

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
      setError('Failed to submit expense. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.25rem'
        }}>
          <FaPaperPlane />
        </div>
        <div>
          <h2>Submit New Expense</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Fill in the details below to submit your expense claim</p>
        </div>
      </div>
      
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Amount Field */}
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaMoneyBillWave style={{ color: '#10b981' }} />
            Amount (₹)
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              ₹
            </div>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaTag style={{ color: '#8b5cf6' }} />
            Category
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              style={{ 
                paddingLeft: '44px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px'
              }}
            >
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Others">Others</option>
            </select>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1rem',
              pointerEvents: 'none'
            }}>
              <FaTag />
            </div>
          </div>
        </div>

        {/* Expense Date Field */}
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCalendar style={{ color: '#ef4444' }} />
            Expense Date
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
              style={{ paddingLeft: '44px' }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1rem',
              pointerEvents: 'none'
            }}>
              <FaCalendar />
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFileAlt style={{ color: '#f59e0b' }} />
            Description (Optional)
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add a brief description of the expense..."
              style={{ paddingLeft: '44px', paddingTop: '12px' }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
              color: '#94a3b8',
              fontSize: '1rem',
              pointerEvents: 'none'
            }}>
              <FaFileAlt />
            </div>
          </div>
        </div>

        {/* Receipt Details Field */}
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaReceipt style={{ color: '#06b6d4' }} />
            Receipt/Bill Details (Optional)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="receiptDetails"
              value={formData.receiptDetails}
              onChange={handleChange}
              placeholder="e.g. Bill no. 1234, Hotel XYZ, Invoice #456"
              style={{ paddingLeft: '44px' }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '1rem',
              pointerEvents: 'none'
            }}>
              <FaReceipt />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaPaperPlane style={{ marginRight: '8px' }} />
                Submit Expense
              </>
            )}
          </button>
        </div>
      </form>

      {/* Form Tips */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span style={{ color: '#3b82f6' }}>💡</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Quick Tips:</span>
        </div>
        <ul style={{ 
          fontSize: '0.75rem', 
          color: '#64748b',
          listStyleType: 'none',
          paddingLeft: '0',
          lineHeight: '1.6'
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#10b981' }}>✓</span>
            <span>Enter exact amount as shown on receipt</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: '#10b981' }}>✓</span>
            <span>Select the most appropriate category</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ color: '#10b981' }}>✓</span>
            <span>Add receipt details for faster approval</span>
          </li>
        </ul>
      </div>
    </div>
  );
}