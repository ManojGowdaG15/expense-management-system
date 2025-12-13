// src/pages/ManagerDashboard.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExpenseTable from '../components/ExpenseTable';
import { getAllExpenses, getDashboard, updateExpenseStatus } from '../services/api';

export default function ManagerDashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [expRes, dashRes] = await Promise.all([getAllExpenses(), getDashboard()]);
      setExpenses(expRes.data);
      setSummary(dashRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, data) => {
    try {
      await updateExpenseStatus(id, data);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container text-center mt-20"><h2>Loading...</h2></div>;

  return (
    <>
      <Navbar user={user} setUser={() => {}} />
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Manager Dashboard</h1>

        <div className="grid-2">
          <div className="summary-card">
            <h3>Pending Claims</h3>
            <div className="amount">{summary.pendingCount || 0}</div>
          </div>
          <div className="summary-card">
            <h3>Total Pending Amount</h3>
            <div className="amount">₹{summary.totalPendingAmount?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <ExpenseTable
          expenses={expenses}
          isManager={true}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </>
  );
}