import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useB2BAdminStore } from '../store/b2bAdminStore';

const B2BProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useB2BAdminStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page, passing the intent
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default B2BProtectedRoute;
