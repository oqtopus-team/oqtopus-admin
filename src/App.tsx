import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import 'aframe';
import 'aframe-extras';
import { useAuth } from './hooks/use-auth';
import { LoadingProvider } from './common/Loader';
import LogIn from './login/LogIn';
import UserList from './user/UserList';
import PasswordChange from './login/PasswordChange';
import FirstPasswordChange from './login/FirstPasswordChange';
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

const App: React.FC = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div></div>;
  }

  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          <Route index element={<LogIn />} />
          <Route path="login" element={<LogIn />} />
          <Route path="users" element={<UserList />}></Route>
          <Route path="password-change" element={<PasswordChange />}></Route>
          <Route path="first-password-change" element={<FirstPasswordChange />}></Route>
          <Route path="whitelist" element={<WhitelistUserList />} />
          <Route path="whitelist-register" element={<WhitelistUserRegister />} />
          <Route path="device" element={<DeviceList />} />
          <Route path="device/form/edit" element={<DeviceRegisterEdit />} />
          <Route path="device/form/confirm" element={<DeviceRegisterConfirm />} />
          <Route path="device/:deviceId" element={<DeviceDetail />} />
          <Route path="device/form/:deviceId/edit" element={<DeviceUpdateEdit />} />
          <Route path="device/form/:deviceId/confirm" element={<DeviceUpdateConfirm />} />
          <Route path="confirm-mfa" element={<ConfirmMFA />} />
          <Route path="setup-mfa" element={<SetupMFA />} />
          <Route path="*" element={<p>Page Not Found</p>} />
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
