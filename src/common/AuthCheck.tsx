import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const AuthCheck: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

export default AuthCheck;
