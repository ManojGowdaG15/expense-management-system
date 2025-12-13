// src/pages/ManagerDashboard.jsx - COMPLETE
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExpenseTable from '../components/ExpenseTable';
import { getAllExpenses, getDashboard, updateExpenseStatus } from '../services/api';
import { 
  FaUserTie, 
  FaClock, 
  FaRupeeSign, 
  FaChartBar,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHistory
} from 'react-icons/fa';

export default function ManagerDashboard({ user, setUser }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    pendingCount: 0,
    totalPendingAmount: 0,
    recentPending: []
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [expRes, dashRes] = await Promise.all([getAllExpenses(), getDashboard()]);
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

  const handleStatusUpdate = async (id, data) => {
    setActionLoading(true);
    try {
      await updateExpenseStatus(id, data);
      fetchData();
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate statistics
  const pendingExpenses = expenses.filter(exp => exp.status === 'Pending');
  const approvedExpenses = expenses.filter(exp => exp.status === 'Approved');
  const rejectedExpenses = expenses.filter(exp => exp.status === 'Rejected');
  const approvalRate = expenses.length > 0 
    ? Math.round((approvedExpenses.length / (expenses.length - pendingExpenses.length)) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading manager dashboard...</p>
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.75rem',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              <FaUserTie />
            </div>
            <div>
              <h1>Manager Dashboard</h1>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>
                Welcome, {user.name}! Review and manage expense claims.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid-2 fade-in">
          <div className="summary-card">
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaClock /> Pending Claims
            </h3>
            <div className="amount">{summary.pendingCount || 0}</div>
            <div className="subtitle">
              {pendingExpenses.length === 0 ? 'All caught up!' : 'Requires your attention'}
            </div>
          </div>
          
          <div className="summary-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaRupeeSign /> Total Pending Amount
            </h3>
            <div className="amount">₹{summary.totalPendingAmount?.toFixed(2) || '0.00'}</div>
            <div className="subtitle">Awaiting approval</div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid-3 fade-in" style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              <FaCheckCircle />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>{approvedExpenses.length}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Approved Claims</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              <FaTimesCircle />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>{rejectedExpenses.length}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Rejected Claims</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              <FaChartBar />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>{approvalRate}%</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Approval Rate</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          marginTop: '2rem',
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Action Required</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {pendingExpenses.length === 0 
                    ? 'No pending claims. Great job!' 
                    : `${pendingExpenses.length} expense claims require your review`}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={fetchData}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                disabled={actionLoading}
              >
                <FaSpinner /> Refresh Data
              </button>
              
              <button
                onClick={() => {
                  // Scroll to pending section if exists
                  const pendingSection = document.querySelector('.status-pending');
                  if (pendingSection) {
                    pendingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                disabled={pendingExpenses.length === 0}
              >
                <FaClock /> Review Pending
              </button>
            </div>
          </div>
        </div>

        {/* Expense Table */}
        <div className="fade-in">
          <ExpenseTable
            expenses={expenses}
            isManager={true}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>

        {/* Processing Info */}
        {actionLoading && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <FaSpinner className="spinner" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }} />
            <span>Processing your request...</span>
          </div>
        )}

        {/* Stats Summary */}
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              <FaHistory />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '1rem' }}>Expense Processing Summary</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Total Claims:</span>
                    <span style={{ fontWeight: '600' }}>{expenses.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Pending Review:</span>
                    <span style={{ fontWeight: '600', color: '#f59e0b' }}>{pendingExpenses.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Approved:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{approvedExpenses.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Rejected:</span>
                    <span style={{ fontWeight: '600', color: '#ef4444' }}>{rejectedExpenses.length}</span>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Approval Rate:</span>
                    <span style={{ fontWeight: '600' }}>{approvalRate}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Avg Processing Time:</span>
                    <span style={{ fontWeight: '600' }}>24-48 hrs</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Total Amount Processed:</span>
                    <span style={{ fontWeight: '600' }}>
                      ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}