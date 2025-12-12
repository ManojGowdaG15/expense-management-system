import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyExpenses from "./pages/MyExpenses";
import SubmitExpense from "./pages/SubmitExpense";
import PendingApprovals from "./pages/PendingApprovals";
import { useState, createContext, useContext } from "react";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/my-expenses"
            element={user?.role === "employee" ? <MyExpenses /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/submit-expense"
            element={user?.role === "employee" ? <SubmitExpense /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/approvals"
            element={user?.role === "manager" ? <PendingApprovals /> : <Navigate to="/dashboard" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;