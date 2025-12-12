import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function PendingApprovals() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://your-backend-url.onrender.com/api/expenses/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to load");
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    const comment = action === "Rejected" ? prompt("Reason for rejection?") || "" : "";
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://your-backend-url.onrender.com/api/expenses/${id}`,
        { status: action, managerComment: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPending();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Pending Expense Approvals</h2>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No pending approvals</p>
        ) : (
          <div>
            {expenses.map(exp => (
              <div key={exp._id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>{exp.user.name}</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0' }}>₹{exp.amount}</p>
                    <p style={{ color: '#64748b' }}>
                      {exp.category} • {new Date(exp.expenseDate).toLocaleDateString()}
                    </p>
                    {exp.description && <p style={{ marginTop: '0.8rem' }}>{exp.description}</p>}
                    {exp.receipt && <p style={{ marginTop: '0.5rem', color: '#2563eb' }}>Receipt: {exp.receipt}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleAction(exp._id, "Approved")} className="btn btn-primary">
                      Approve
                    </button>
                    <button onClick={() => handleAction(exp._id, "Rejected")} className="btn btn-danger">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}