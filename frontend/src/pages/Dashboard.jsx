import { useContext } from "react";
import { AuthContext } from "../App";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Welcome back, {user?.name} ({user?.role.toUpperCase()})
        </h2>

        <div className="grid">
          {user?.role === "employee" ? (
            <>
              <Link to="/submit-expense" className="grid-item">
                <div style={{ fontSize: '4rem' }}>+</div>
                <h3>Submit New Expense</h3>
              </Link>
              <Link to="/my-expenses" className="grid-item">
                <div style={{ fontSize: '4rem' }}>List</div>
                <h3>View My Expenses</h3>
              </Link>
            </>
          ) : (
            <>
              <Link to="/approvals" className="grid-item">
                <div style={{ fontSize: '4rem', color: '#ea580c' }}>Clock</div>
                <h3>Pending Approvals</h3>
                <p style={{ fontSize: '2.5rem', marginTop: '1rem', color: '#ea580c' }}>7</p>
              </Link>
              <div className="grid-item">
                <div style={{ fontSize: '4rem', color: '#16a34a' }}>Check</div>
                <h3>Approved This Month</h3>
                <p style={{ fontSize: '2rem', marginTop: '1rem', color: '#16a34a' }}>₹1,24,500</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}