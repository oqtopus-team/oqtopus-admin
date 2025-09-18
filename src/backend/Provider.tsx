import * as OAS from '../api/generated';
import { createContext } from 'react';

interface UserAPI {
  device: OAS.DevicesApi;
  UserApi: OAS.UserApi;
  WhitelistUsersApi: OAS.WhitelistUsersApi;
  announcements: OAS.AnnouncementsApi;
}

export const newUserAPI = (config?: OAS.ConfigurationParameters): UserAPI => {
  return {
    device: new OAS.DevicesApi(new OAS.Configuration(config)),
    UserApi: new OAS.UserApi(new OAS.Configuration(config)),
    WhitelistUsersApi: new OAS.WhitelistUsersApi(new OAS.Configuration(config)),
    announcements: new OAS.AnnouncementsApi(new OAS.Configuration(config)),
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
