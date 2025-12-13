// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const logout = async () => {
    // Call logout API
    // Clear user state
    setUser(null);
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};