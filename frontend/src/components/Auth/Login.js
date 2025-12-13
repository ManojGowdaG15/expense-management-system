import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHook } from '../../hooks/useAuth';
import ErrorMessage from '../Common/ErrorMessage';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuthHook();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert('Forgot password feature to be implemented');
  };

  const handleCredentialClick = (credEmail, credPassword) => {
    setEmail(credEmail);
    setPassword(credPassword);
  };

  const demoCredentials = [
    { role: 'Employee', email: 'john.developer@datasturdy.com', password: 'employee123' },
    { role: 'Manager', email: 'engmanager@datasturdy.com', password: 'manager123' },
    { role: 'Finance', email: 'finance@test.com', password: 'finance123' },
    { role: 'Admin', email: 'admin@datasturdy.com', password: 'admin123' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Expense Management</h1>
          <p>Sign in to access your expense dashboard</p>
        </div>
        
        {error && (
          <ErrorMessage message={error} />
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <span className="form-label-text">Email Address</span>
              <span className="forgot-password" onClick={handleForgotPassword}>
                Forgot password?
              </span>
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>
              <span className="form-label-text">Password</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="form-input"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="demo-title">Demo Accounts</div>
          <div className="credentials-grid">
            {demoCredentials.map((cred, index) => (
              <div 
                key={index} 
                className="credential-card"
                onClick={() => handleCredentialClick(cred.email, cred.password)}
              >
                <div className="credential-role">{cred.role}</div>
                <div className="credential-details">
                  {cred.email}<br/>
                  {cred.password}
                </div>
              </div>
            ))}
          </div>
          <div className="click-hint">Click any card to auto-fill credentials</div>
        </div>
      </div>
    </div>
  );
};

export default Login;