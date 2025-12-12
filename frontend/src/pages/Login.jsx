import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem' }}>ExpensePro</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="message error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Login</button>
        </form>
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.9rem' }}>
          <strong>Test Accounts:</strong><br/>
          Employee: employee@example.com / 123456<br/>
          Manager: manager@example.com / 123456
        </div>
      </div>
    </div>
  );
}