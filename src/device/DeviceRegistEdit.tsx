import React, { useEffect } from 'react';
import { DeviceForm } from '../types/DeviceType';
import { useLocation } from 'react-router';
import { DeviceFormEdit } from './form/DeviceFormEdit';
import { useAuth } from '../hooks/use-auth';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

export const DeviceRegisterEdit: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('device.register.title')} | ${appName}`;
  }, [auth.idToken]);

  const inputData = (() => {
    try {
      if ((location.state as { formData: DeviceForm }).formData != null) {
        return (location.state as { formData: DeviceForm }).formData;
      } else return undefined;
    } catch (e) {
      return undefined;
    }
  })();
  return (
    <>
      <DeviceFormEdit inputData={inputData} navigatePath="/device/form/confirm" />
    </>
  );
};
