import * as OAS from '../api/generated';
import { createContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import { isProxyMode } from '../hooks/use-auth';

interface UserAPI {
  device: OAS.DevicesApi;
  UserApi: OAS.UserApi;
  WhitelistUsersApi: OAS.WhitelistUsersApi;
  announcements: OAS.AnnouncementsApi;
}

// In proxy (BFF) mode the SPA holds no token: it sends the reverse proxy's
// session cookie (withCredentials) and the proxy injects the Bearer upstream.
// On an expired/absent session the API returns 401, which we turn into a
// top-level redirect back through the proxy login. In cognito mode the default
// (global) axios is used and the id token is sent as the Bearer via the
// Configuration's accessToken.
const createApiAxios = (): AxiosInstance | undefined => {
  if (!isProxyMode) return undefined;
  const instance = axios.create({ withCredentials: true });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        const rd = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/oauth2/start?rd=${rd}`;
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export const newUserAPI = (config?: OAS.ConfigurationParameters): UserAPI => {
  const client = createApiAxios();
  const cfg = new OAS.Configuration(config);
  return {
    device: new OAS.DevicesApi(cfg, undefined, client),
    UserApi: new OAS.UserApi(cfg, undefined, client),
    WhitelistUsersApi: new OAS.WhitelistUsersApi(cfg, undefined, client),
    announcements: new OAS.AnnouncementsApi(cfg, undefined, client),
  };
};

export const userApiContext = createContext({} as UserAPI);

export const UserAPIProvider: React.FC<OAS.ConfigurationParameters & React.PropsWithChildren> = ({
  children,
  ...config
}) => {
  const api = newUserAPI(config);
  return <userApiContext.Provider value={api}>{children}</userApiContext.Provider>;
};
