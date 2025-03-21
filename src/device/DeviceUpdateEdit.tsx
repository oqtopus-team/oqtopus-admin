import { DeviceForm, Device } from '../types/DeviceType';
import { useAuth } from '../hooks/use-auth';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router-dom';
import { getDevice } from './DeviceApi';
import { DeviceFormEdit } from './form/DeviceFormEdit';
import BaseLayout from '../common/BaseLayout';
import { useTranslation } from 'react-i18next';

const convertDbdataToFormdata = (data: Device): DeviceForm => {
  return {
    deviceType: data.deviceType,
    deviceInfo: data.deviceInfo ?? '',
    status: data.status,
    qubits: data.nQubits,
    availableAt: data.availableAt != null ? new Date(data.availableAt) : undefined,
    calibratedAt: data.calibratedAt != null ? new Date(data.calibratedAt) : undefined,
    basisGates: data.basisGates.join(','),
    instructions: data.supportedInstructions.join(','),
    description: data.description,
  };
};

const appName: string = import.meta.env.VITE_APP_NAME;

export const DeviceUpdateEdit: React.FC = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState<Device>();
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('device.update.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    if (deviceId !== undefined && auth.idToken !== undefined) {
      getDevice(deviceId, auth.idToken)
        .then((device: Device) => {
          setDevice(device);
        })
        .catch((error) => {
          console.error('Failed to fetch device:', error);
        });
    }
  }, [deviceId, auth.idToken]);

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
    <BaseLayout>
      {device != null && deviceId != null && (
        <DeviceFormEdit
          dbData={convertDbdataToFormdata(device)}
          inputData={inputData}
          navigatePath={`/device/form/${deviceId}/confirm`}
        />
      )}
    </BaseLayout>
  );
};
