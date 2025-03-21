import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const LogInRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/users" /> : <>{children}</>;
};

export default LogInRoute;
