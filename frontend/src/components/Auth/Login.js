import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('employee@test.com');
  const [password, setPassword] = useState('employee123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    switch(role) {
      case 'employee':
        setEmail('employee@test.com');
        setPassword('employee123');
        break;
      case 'manager':
        setEmail('manager@test.com');
        setPassword('manager123');
        break;
      case 'finance':
        setEmail('finance@test.com');
        setPassword('finance123');
        break;
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FiLogIn />
          </div>
          <h1>Expense Manager</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary login-btn"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-title">Quick login for testing:</p>
          <div className="quick-login-buttons">
            <button
              onClick={() => handleQuickLogin('employee')}
              className="quick-login-btn employee"
            >
              Employee
            </button>
            <button
              onClick={() => handleQuickLogin('manager')}
              className="quick-login-btn manager"
            >
              Manager
            </button>
            <button
              onClick={() => handleQuickLogin('finance')}
              className="quick-login-btn finance"
            >
              Finance
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p className="text-center text-sm text-gray-600">
            For Assignment Testing
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            Use the quick login buttons above
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;