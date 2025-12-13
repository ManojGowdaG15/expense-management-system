// src/pages/Login.jsx
import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login({ email, password });
      setUser(res.data.user);
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Expense Management</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="employee@example.com"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="emp123 or mgr123"
            />
          </div>
          {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px', color: '#7f8c8d' }}>
          <p style={{ textAlign: 'center', fontWeight: '600', marginBottom: '8px' }}>Test Accounts:</p>
          <p>• Employee: employee@example.com / emp123</p>
          <p>• Manager: manager@example.com / mgr123</p>
        </div>
      </div>
    </div>
  );
}