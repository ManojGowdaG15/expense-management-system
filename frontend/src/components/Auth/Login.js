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
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const createTestUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/create-test-users', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        alert('Test users created successfully!\n\nUse these credentials to login:\n\n' +
              'employee@test.com / password\n' +
              'manager@test.com / password\n' +
              'finance@test.com / password\n' +
              'admin@test.com / password');
      }
    } catch (error) {
      alert('Error creating test users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Expense Management</h1>
          <p>Sign in to your account</p>
        </div>
        
        {error && (
          <ErrorMessage message={error} />
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
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
          <button 
            onClick={createTestUsers}
            className="test-users-btn"
            disabled={loading}
            type="button"
          >
            Create Test Users
          </button>
          <p className="test-credentials">
            Use: employee@test.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
