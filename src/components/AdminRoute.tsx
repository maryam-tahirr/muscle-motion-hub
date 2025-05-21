
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '@/services/authService';

const AdminRoute: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
