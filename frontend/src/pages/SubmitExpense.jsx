import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_URL } from "../config.js";

export default function SubmitExpense() {
  const [form, setForm] = useState({
    amount: "", category: "Travel", expenseDate: "", description: "", receipt: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/expenses`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Expense submitted successfully!");
      setTimeout(() => navigate("/my-expenses"), 1500);
    } catch (err) {
      setMessage("Failed to submit");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Submit New Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e => setForm({...form, category: e.target.value}))}>
                <option>Travel</option><option>Food</option><option>Accommodation</option>
                <option>Office Supplies</option><option>Others</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.expenseDate} onChange={(e) => setForm({...form, expenseDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}></textarea>
            </div>
            <div className="form-group">
              <label>Receipt Link (Optional)</label>
              <input type="text" value={form.receipt} onChange={(e) => setForm({...form, receipt: e.target.value})} />
            </div>
            {message && <div className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</div>}
            <button type="submit" className="btn btn-primary" style={{width:'100%', padding:'1rem'}}>Submit Expense</button>
          </form>
        </div>
      </div>
    </>
  );
}