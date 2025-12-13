import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthHook } from '../../hooks/useAuth';
import './Layout.css';

const Sidebar = () => {
  const { user, isEmployee, isManager, isFinance, isAdmin } = useAuthHook();

  if (!user) return null;

  const employeeLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/expenses', label: 'My Expenses', icon: '💰' },
    { to: '/submit-expense', label: 'Submit Expense', icon: '➕' }
  ];

  const managerLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/pending-expenses', label: 'Pending', icon: '⏳' },
    { to: '/team-expenses', label: 'Team', icon: '👥' }
  ];

  const financeLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/reimbursements', label: 'Reimbursements', icon: '💳' },
    { to: '/reports', label: 'Reports', icon: '📈' }
  ];

  let links = [];
  if (isEmployee()) links = employeeLinks;
  if (isManager()) links = managerLinks;
  if (isFinance()) links = financeLinks;
  if (isAdmin()) links = [...managerLinks, ...financeLinks];

  return (
    <nav className="sidebar">
      <div className="sidebar-menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-label">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
