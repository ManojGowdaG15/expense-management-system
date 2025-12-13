// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);                // This clears the user state
      navigate('/login');           // Redirect to login
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="navbar">
      <div className="container">
        <h1>Expense Management System</h1>
        <div className="flex gap-16 align-center">
          <span>Welcome, <strong>{user.name}</strong> <span style={{color:'#a0d911', fontSize:'12px'}}>({user.role.toUpperCase()})</span></span>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}