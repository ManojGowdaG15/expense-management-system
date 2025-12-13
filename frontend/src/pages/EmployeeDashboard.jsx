// src/pages/EmployeeDashboard.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import { getMyExpenses, getDashboard } from '../services/api';

export default function EmployeeDashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [expRes, dashRes] = await Promise.all([getMyExpenses(), getDashboard()]);
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

  if (loading) return <div className="container text-center mt-20"><h2>Loading...</h2></div>;

  return (
    <>
      <Navbar user={user} setUser={() => {}} />
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Employee Dashboard</h1>

        <div className="grid-3">
          <div className="summary-card">
            <h3>Total Submitted</h3>
            <div className="amount">₹{summary.totalSubmitted?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="summary-card">
            <h3>Approved Amount</h3>
            <div className="amount">₹{summary.approvedAmount?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="summary-card">
            <h3>Pending Claims</h3>
            <div className="amount">{summary.pendingCount || 0}</div>
          </div>
        </div>

        <ExpenseForm onSuccess={fetchData} />

        <ExpenseTable expenses={expenses} />
      </div>
    </>
  );
}