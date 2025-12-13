import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthHook } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuthHook();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
