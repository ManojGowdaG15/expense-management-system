import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthHook } from '../../hooks/useAuth';
import { 
  DashboardIcon, 
  ExpensesIcon, 
  AddExpenseIcon, 
  PendingIcon, 
  TeamIcon, 
  ReimbursementsIcon, 
  ReportsIcon 
} from '../Common/Icons';
import './Layout.css';

const Sidebar = () => {
  const { user, isEmployee, isManager, isFinance, isAdmin } = useAuthHook();

  if (!user) return null;

  const employeeLinks = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/expenses', label: 'My Expenses', icon: <ExpensesIcon /> },
    { to: '/submit-expense', label: 'Submit Expense', icon: <AddExpenseIcon /> }
  ];

  const managerLinks = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/pending-expenses', label: 'Pending', icon: <PendingIcon /> },
    { to: '/team-expenses', label: 'Team', icon: <TeamIcon /> }
  ];

  const financeLinks = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/reimbursements', label: 'Reimbursements', icon: <ReimbursementsIcon /> },
    { to: '/reports', label: 'Reports', icon: <ReportsIcon /> }
  ];

  let links = [];
  if (isEmployee()) links = employeeLinks;
  if (isManager()) links = managerLinks;
  if (isFinance()) links = financeLinks;
  if (isAdmin()) links = [...managerLinks, ...financeLinks];

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h3>Expense Management</h3>
      </div>
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