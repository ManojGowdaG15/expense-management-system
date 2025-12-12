import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("https://your-backend-url.onrender.com/api/expenses/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setExpenses(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>My Expense History</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p>
        ) : expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No expenses submitted yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp._id}>
                  <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                  <td><strong>₹{exp.amount}</strong></td>
                  <td>{exp.category}</td>
                  <td>
                    <span className={`status status-${exp.status.toLowerCase()}`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}