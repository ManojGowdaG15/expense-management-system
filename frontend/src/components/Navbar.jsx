// src/components/Navbar.jsx - COMPLETE
import { logout } from '../services/api';
import { 
  FaSignOutAlt, 
  FaUserCircle, 
  FaUserTie,
  FaUser,
  FaBuilding
} from 'react-icons/fa';

export default function Navbar({ user, setUser }) {
  const handleLogout = async () => {
    try {
      await logout();
      
      // Clear user state
      if (setUser) {
        setUser(null);
      }
      
      // Clear any cached data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      // Force reload to login page
      window.location.href = '/login';
      
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout anyway
      if (setUser) {
        setUser(null);
      }
      window.location.href = '/login';
    }
  };

  const getUserIcon = () => {
    if (user.role === 'manager') {
      return <FaUserTie />;
    }
    return <FaUser />;
  };

  return (
    <div className="navbar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <FaBuilding />
          </div>
          <div>
            <h1>Expense Management System</h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              Professional Expense Tracking Solution
            </p>
          </div>
        </div>
        
        <div className="user-info">
          <div className="user-details">
            <div className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {getUserIcon()}
              Welcome, {user.name}
            </div>
            <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {user.role === 'manager' ? (
                <>
                  <FaUserTie style={{ fontSize: '0.7rem' }} />
                  Manager Access
                </>
              ) : (
                <>
                  <FaUser style={{ fontSize: '0.7rem' }} />
                  Employee Access
                </>
              )}
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}>
              <FaUserCircle />
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ 
                padding: '10px 20px', 
                fontSize: '0.875rem',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <FaSignOutAlt style={{ marginRight: '6px' }} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}