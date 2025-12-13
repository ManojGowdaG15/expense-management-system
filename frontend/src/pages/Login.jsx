// src/pages/Login.jsx - ENHANCED
import { useState } from 'react';
import { login } from '../services/api';
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight,
  FaBuilding,
  FaUserTie,
  FaUser
} from 'react-icons/fa';
import { MdError } from 'react-icons/md';

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
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="logo" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <FaBuilding />
          </div>
          <h1 className="login-title">Expense Management System</h1>
          <p className="login-subtitle">Secure login to manage your expenses</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '1rem'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '1rem'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>
          
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MdError style={{ fontSize: '1.25rem', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ 
            textAlign: 'center', 
            fontWeight: '600', 
            color: '#475569', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <FaUser style={{ color: '#94a3b8' }} />
            Demo Accounts
          </p>
          
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0'
          }}>
            {/* Employee Account */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem'
              }}>
                <FaUser />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                  Employee Account
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  employee@example.com
                </div>
              </div>
              <div style={{
                background: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#475569'
              }}>
                emp123
              </div>
            </div>
            
            {/* Manager Account */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem'
              }}>
                <FaUserTie />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                  Manager Account
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  manager@example.com
                </div>
              </div>
              <div style={{
                background: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#475569'
              }}>
                mgr123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}