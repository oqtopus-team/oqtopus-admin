import React, { useEffect, useState } from 'react';
import BaseLayout from '../common/BaseLayout';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router';
import { getDevices } from './DeviceApi';
import { SortDeviceTable } from './SortDeviceTable';
import { Device } from '../types/DeviceType';
import { useAuth } from '../hooks/use-auth';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const auth = useAuth();
  const navigate = useNavigate();
  const handleRegisterDevice = (): void => {
    navigate('/device/form/edit');
  };
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('device.title')} | ${appName}`;
  }, [auth.idToken]);

  const fetchDevices = (): void => {
    getDevices(auth.idToken)
      .then((devices: Device[]) => {
        setDevices(devices);
      })
      .catch((error) => {
        console.error('Failed to fetch devices:', error);
      });
  };

  useEffect(() => {
    fetchDevices();
    const intervalId = setInterval(fetchDevices, 60000);
    return (): void => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <BaseLayout>
      <Button className="mb-3" variant="primary" onClick={handleRegisterDevice}>
        {' '}
        {t('device.register.button')}{' '}
      </Button>
      <SortDeviceTable devices={devices} />
    </BaseLayout>
  );
};

export default DeviceList;
