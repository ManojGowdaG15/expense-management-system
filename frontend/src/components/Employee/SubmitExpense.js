import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiUpload, FiArrowLeft } from 'react-icons/fi';
import { expenseAPI } from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const SubmitExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'travel',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    vendorName: '',
    paymentMethod: 'credit_card',
    receiptNumber: '',
    receiptFile: null,
  });

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'others', label: 'Others' },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'online', label: 'Online Payment' },
    { value: 'corporate_card', label: 'Corporate Card' },
  ];

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
      receiptFile: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('amount', formData.amount);
      formDataObj.append('category', formData.category);
      formDataObj.append('expenseDate', formData.expenseDate);
      formDataObj.append('description', formData.description);
      formDataObj.append('vendorName', formData.vendorName);
      formDataObj.append('paymentMethod', formData.paymentMethod);
      formDataObj.append('receiptNumber', formData.receiptNumber);
      
      if (formData.receiptFile) {
        formDataObj.append('receipt', formData.receiptFile);
      }

      await expenseAPI.createExpense(formDataObj);
      toast.success('Expense submitted successfully!');
      navigate('/expenses');
    } catch (error) {
      toast.error(error.message || 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Submit Expense Claim</h1>
        <button onClick={() => navigate('/expenses')} className="btn btn-secondary">
          <FiArrowLeft />
          Back to Expenses
        </button>
      </div>

      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Expense Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter amount"
                  required
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expense Date</label>
                <input
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group md:col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Describe the expense..."
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter vendor name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Receipt Number</label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter receipt number"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="form-label">Receipt Upload</label>
                <div className="input-with-icon">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="input"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />
                  <FiUpload className="input-icon" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload receipt (JPG, PNG, PDF, DOC - Max 5MB)
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/expenses')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <FiSave />
                    Submit Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;