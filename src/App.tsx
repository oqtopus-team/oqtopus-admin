import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { useAuth, isProxyMode } from './hooks/use-auth';
import { LoadingProvider } from './common/Loader';
import SignIn from './signin/SignIn';
import UserList from './user/UserList';
import PasswordChange from './signin/PasswordChange';
import FirstPasswordChange from './signin/FirstPasswordChange';
import WhitelistUserList from './whitelist_user/WhitelistUserList';
import WhitelistUserRegister from './whitelist_user/WhitelistUserRegister';
import DeviceList from './device/DeviceList';
import { DeviceRegisterEdit } from './device/DeviceRegistEdit';
import { DeviceRegisterConfirm } from './device/DeviceRegisterConfirm';
import { DeviceDetail } from './device/DeviceDetail';
import { DeviceUpdateEdit } from './device/DeviceUpdateEdit';
import { DeviceUpdateConfirm } from './device/DeviceUpdateConfirm';
import ConfirmMFA from './mfa/ConfirmMFA';
import SetupMFA from './mfa/SetupMFA';
import AnnouncementsList from './announcements/AnnouncementsList';
import AnnouncementEditor from './announcements/AnnouncementEditor';
import { UserEdit } from './user/UserEdit';
import BaseLayout from './common/BaseLayout';
import { setupInterceptors } from './api/api-interceptor-error';

const App: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    setupInterceptors();
  }, []);

  if (auth.isLoading) {
    return <div></div>;
  }

  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          {isProxyMode ? (
            // Proxy mode: login/MFA/password are owned by the IdP (Keycloak) via
            // oauth2-proxy, so there is no in-app auth page. Send the entry
            // routes into the app, which gates via AuthCheck (-> proxy login).
            <>
              <Route index element={<Navigate to="/users" replace />} />
              <Route path="signin" element={<Navigate to="/users" replace />} />
            </>
          ) : (
            <>
              <Route index element={<SignIn />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="first-password-change" element={<FirstPasswordChange />} />
              <Route path="confirm-mfa" element={<ConfirmMFA />} />
              <Route path="setup-mfa" element={<SetupMFA />} />
            </>
          )}
          <Route element={<BaseLayout />}>
            <Route path="users" element={<UserList />} />
            <Route path="users/edit/:userId" element={<UserEdit />} />
            {/* Password change is delegated to the IdP (Keycloak) in proxy mode;
                block the in-app route so a direct URL can't reach the form. */}
            <Route
              path="password-change"
              element={isProxyMode ? <Navigate to="/users" replace /> : <PasswordChange />}
            />
            <Route path="whitelist" element={<WhitelistUserList />} />
            <Route path="whitelist-register" element={<WhitelistUserRegister />} />
            <Route path="device" element={<DeviceList />} />
            <Route path="device/form/edit" element={<DeviceRegisterEdit />} />
            <Route path="device/form/confirm" element={<DeviceRegisterConfirm />} />
            <Route path="device/:deviceId" element={<DeviceDetail />} />
            <Route path="device/form/:deviceId/edit" element={<DeviceUpdateEdit />} />
            <Route path="device/form/:deviceId/confirm" element={<DeviceUpdateConfirm />} />
            <Route path="announcements" element={<AnnouncementsList />} />
            <Route path="announcements/create" element={<AnnouncementEditor />} />
            <Route path="announcements/edit/:postId" element={<AnnouncementEditor />} />
          </Route>
          <Route path="*" element={<p>Page Not Found</p>} />
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
