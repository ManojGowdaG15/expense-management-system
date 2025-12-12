import React from 'react';
import { FiBell, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'employee': return 'badge-primary';
      case 'manager': return 'badge-success';
      case 'finance': return 'badge-info';
      case 'admin': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle-btn"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="header-title">
            <h1>Expense Management</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="notification-btn">
            <FiBell />
            <span className="notification-badge"></span>
          </button>

          <div className="user-menu">
            <button className="user-btn">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className={`user-role ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </button>
            
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
              <button onClick={logout} className="logout-btn">
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;