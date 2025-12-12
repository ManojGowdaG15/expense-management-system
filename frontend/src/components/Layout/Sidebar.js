import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiPlusCircle,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const employeeLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/expenses', icon: FiFileText, label: 'My Expenses' },
    { to: '/expenses/new', icon: FiPlusCircle, label: 'Submit Expense' },
  ];

  const managerLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/expenses/pending', icon: FiCheckCircle, label: 'Pending Approvals' },
    { to: '/expenses/team', icon: FiUsers, label: 'Team Expenses' },
  ];

  const financeLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/expenses/reimbursements', icon: FiDollarSign, label: 'Reimbursements' },
    { to: '/reports', icon: FiBarChart2, label: 'Reports' },
  ];

  const commonLinks = [
    { to: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const getLinks = () => {
    switch(user?.role) {
      case 'employee':
        return [...employeeLinks, ...commonLinks];
      case 'manager':
        return [...managerLinks, ...commonLinks];
      case 'finance':
        return [...financeLinks, ...commonLinks];
      default:
        return [...employeeLinks, ...commonLinks];
    }
  };

  const links = getLinks();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiDollarSign className="logo-icon" />
            <h2>Expense Manager</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <link.icon />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <p className="profile-name">{user?.name}</p>
              <p className="profile-role">{user?.role?.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;