import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeviceAPI } from '../device/DeviceApi';
import { useAuth } from '../hooks/use-auth';
import { Device } from '../types/DeviceType';
import { useNavigate } from 'react-router';
import { DeviceDetailBasicInfo } from './_components/DeviceDetailBasicInfo';
import { TopologyInfo } from './_components/TopologyInfo';
import Button from 'react-bootstrap/Button';
import { DeleteConfirmation } from './_components/DeviceDeleteModal';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

export const DeviceDetail: React.FC = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState<Device>();
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const { getDevice } = useDeviceAPI();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = `${t('device.detail.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    if (deviceId !== undefined) {
      getDevice(deviceId)
        .then((device: Device | null) => {
          if (device !== null) {
            setDevice(device);
          } else {
            console.error('Device not found');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch device:', error);
        });
    }
  }, [deviceId, auth.idToken]);

  const handleEdit = (): void => {
    if (deviceId === undefined) {
      console.error('Device ID is undefined');
      return;
    }
    navigate(`/device/form/${deviceId}/edit`);
  };

  return (
    <>
      {device != null && <DeviceDetailBasicInfo {...device} />}
      <div style={{ height: '3vh' }}></div>
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Delete
        </Button>
        <div style={{ width: '5vw' }}></div>
        <Button onClick={handleEdit}>Edit</Button>
      </div>
      <DeleteConfirmation
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        deviceId={deviceId}
      />
      {device?.deviceType === 'QPU' && (
        <div>
          <div style={{ height: '3vh' }}></div>
          <TopologyInfo deviceInfo={device?.deviceInfo} />
        </div>
      )}
    </>
  );
};
