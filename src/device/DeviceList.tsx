import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router';
import { useDeviceAPI } from '../device/DeviceApi';
import { SortDeviceTable } from './SortDeviceTable';
import { Device } from '../types/DeviceType';
import { useAuth } from '../hooks/use-auth';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const auth = useAuth();
  const { getDevices } = useDeviceAPI();
  const navigate = useNavigate();
  const handleRegisterDevice = (): void => {
    navigate('/device/form/edit');
  };
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('device.title')} | ${appName}`;
  }, [auth.idToken]);

  const fetchDevices = (): void => {
    getDevices()
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
    <>
      <Button className="mb-3" variant="primary" onClick={handleRegisterDevice}>
        {' '}
        {t('device.register.button')}{' '}
      </Button>
      <SortDeviceTable devices={devices} />
    </>
  );
};

export default DeviceList;
