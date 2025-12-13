// src/pages/EmployeeDashboard.jsx - COMPLETE
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import { getMyExpenses, getDashboard } from '../services/api';
import { 
  FaPaperPlane, 
  FaCheckCircle, 
  FaClock, 
  FaUser,
  FaChartLine,
  FaSpinner
} from 'react-icons/fa';

export default function EmployeeDashboard({ user, setUser }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalSubmitted: 0,
    approvedAmount: 0,
    pendingCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [expRes, dashRes] = await Promise.all([getMyExpenses(), getDashboard()]);
      setExpenses(expRes.data);
      setSummary(dashRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        {/* Header Section */}
        <div style={{ 
          marginBottom: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.75rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}>
              <FaUser />
            </div>
            <div>
              <h1>Employee Dashboard</h1>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>
                Welcome back, {user.name}! Manage your expense claims efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid-3 fade-in">
          <div className="summary-card">
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaPaperPlane /> Total Submitted
            </h3>
            <div className="amount">₹{summary.totalSubmitted?.toFixed(2) || '0.00'}</div>
            <div className="subtitle">All-time submitted amount</div>
          </div>
          
          <div className="summary-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaCheckCircle /> Approved Amount
            </h3>
            <div className="amount">₹{summary.approvedAmount?.toFixed(2) || '0.00'}</div>
            <div className="subtitle">Successfully approved claims</div>
          </div>
          
          <div className="summary-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaClock /> Pending Claims
            </h3>
            <div className="amount">{summary.pendingCount || 0}</div>
            <div className="subtitle">Awaiting manager approval</div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                <FaChartLine />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Expense Overview</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {expenses.length} total claims • {summary.pendingCount || 0} pending • {expenses.length - (summary.pendingCount || 0)} processed
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchData}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaSpinner /> Refresh Data
            </button>
          </div>
        </div>

        {/* Expense Form */}
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <ExpenseForm onSuccess={fetchData} />
        </div>

        {/* Expense Table */}
        <div className="fade-in">
          <ExpenseTable expenses={expenses} />
        </div>

        {/* Help Text */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              💡
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Tips for Quick Approval</h3>
              <div style={{ color: '#475569', lineHeight: '1.6' }}>
                <p>• Provide detailed descriptions and attach receipts whenever possible</p>
                <p>• Submit claims within 30 days of the expense date</p>
                <p>• Ensure amounts match receipt totals exactly</p>
                <p>• Use appropriate categories for better tracking</p>
                <p>• Check the status of pending claims regularly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}