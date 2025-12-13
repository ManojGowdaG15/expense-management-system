import { useAuth } from '../context/AuthContext';

export const useAuthHook = () => {
  const auth = useAuth();
  
  const isEmployee = () => auth.user?.role === 'employee';
  const isManager = () => ['manager', 'admin'].includes(auth.user?.role);
  const isFinance = () => ['finance', 'admin'].includes(auth.user?.role);
  const isAdmin = () => auth.user?.role === 'admin';
  
  const hasPermission = (roles) => {
    if (!auth.user) return false;
    return roles.includes(auth.user.role);
  };

  return {
    ...auth,
    isEmployee,
    isManager,
    isFinance,
    isAdmin,
    hasPermission
  };
};
