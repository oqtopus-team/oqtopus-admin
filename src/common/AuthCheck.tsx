import { Navigate } from 'react-router-dom';
import { useAuth, isProxyMode } from '../hooks/use-auth';
import React, { useEffect } from 'react';

interface Props {
  children?: React.ReactNode;
}

const AuthCheck: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // In proxy mode there is no in-app /signin page -- login is owned by the
  // reverse proxy (oauth2-proxy + Keycloak), so an unauthenticated user is sent
  // through the proxy's login with a full-page redirect.
  useEffect(() => {
    if (isProxyMode && !isAuthenticated) {
      const rd = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/oauth2/start?rd=${rd}`;
    }
  }, [isAuthenticated]);

  if (isProxyMode) {
    return isAuthenticated ? <>{children}</> : <></>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

export default AuthCheck;
