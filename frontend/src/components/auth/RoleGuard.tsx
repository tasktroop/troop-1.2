import React from 'react';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  // In a real app, you might decode the JWT or fetch user context
  // For Phase 2 scaffolding, we'll pretend there's a user object in localStorage
  const userStr = localStorage.getItem('user');
  const userRole = userStr ? JSON.parse(userStr).role : 'agent';
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
