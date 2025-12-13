import React from 'react';
import { useAuthHook } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import './Layout.css';

const Header = () => {
  const { user, logout } = useAuthHook();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Expense Management</h1>
      </div>
      <div className="header-right">
        {user && (
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
