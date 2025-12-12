// frontend/src/components/Navbar.jsx
import { useContext } from "react";
import { AuthContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={{
      background: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3182ce' }}>
        ExpensePro
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#4a5568', fontWeight: 500 }}>Dashboard</Link>
          {user?.role === "employee" && (
            <>
              <Link to="/my-expenses" style={{ textDecoration: 'none', color: '#4a5568' }}>My Expenses</Link>
              <Link to="/submit-expense" style={{ textDecoration: 'none', color: '#4a5568' }}>New Expense</Link>
            </>
          )}
          {user?.role === "manager" && (
            <Link to="/approvals" style={{ textDecoration: 'none', color: '#4a5568' }}>Pending Approvals</Link>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#4a5568' }}>Hello, {user?.name}</span>
          <button onClick={handleLogout} style={{
            padding: '0.6rem 1.2rem',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}