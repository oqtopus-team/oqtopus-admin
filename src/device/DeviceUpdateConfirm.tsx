import { useNavigate, useLocation } from 'react-router';
import { DeviceForm } from '../types/DeviceType';
import { useParams } from 'react-router-dom';
import { useDeviceAPI } from '../device/DeviceApi';
import { useAuth } from '../hooks/use-auth';
import { Spacer } from '../common/Spacer';
import { DeviceFormConfirm } from './form/DeviceFormConfirm';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

const generatePatchDevice = (formData: DeviceForm, dbData: DeviceForm): DeviceForm => {
  const patchData: DeviceForm = {} as DeviceForm;

  Object.keys(formData).forEach((key) => {
    if (key in formData) {
      if (key === 'deviceInfo') {
        patchData.deviceInfo = formData.deviceInfo;
      } else if (key === 'availableAt' || key === 'calibratedAt') {
        if (formData[key] != null && dbData[key] != null) {
          const formDate = formData[key] as Date;
          const dbDate = dbData[key] as Date;
          if (formDate.toISOString() !== dbDate.toISOString()) {
            patchData[key] = formData[key];
          }
        }
      } else {
        const formValue = formData[key as keyof DeviceForm];
        const dbValue = dbData[key as keyof DeviceForm];
        if (formValue !== dbValue) {
          if (formValue !== undefined) {
            patchData[key as keyof DeviceForm] = formValue as never;
          }
        }
      }
    }
  });

  return patchData;
};

export const DeviceUpdateConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId } = useParams();
  const auth = useAuth();
  const [formData, setFormData] = useState<DeviceForm>();
  const [dbData, setDbData] = useState<DeviceForm>();
  const [failedSubmissionMessage, setFailedSubmissionMessage] = useState('');
  const [isFailedEdit, setIsFailedEdit] = useState(false);
  const { t } = useTranslation();
  const { patchDevice } = useDeviceAPI();

  useEffect(() => {
    document.title = `${t('device.update.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    if (location.state != null && (location.state as { formData: DeviceForm }).formData != null) {
      setFormData((location.state as { formData: DeviceForm }).formData);
    } else {
      navigate('/device');
    }

    if (location.state != null && (location.state as { dbData: DeviceForm }).dbData != null) {
      setDbData((location.state as { dbData: DeviceForm }).dbData);
    } else {
      navigate('/device');
    }
  }, [location, navigate]);

  const handleEdit = (): void => {
    if (deviceId != null) {
      navigate(`/device/form/${deviceId}/edit`, location);
    } else {
      setIsFailedEdit(true);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (deviceId != null && formData != null && dbData != null) {
      const res = await patchDevice(deviceId, generatePatchDevice(formData, dbData));
      if (res.success) {
        navigate('/device');
      } else {
        setFailedSubmissionMessage(res.message);
      }
    } else {
      setFailedSubmissionMessage('Form data is invalid.');
    }
  };

  return (
    <>
      {formData != null && <DeviceFormConfirm inputData={formData} />}
      <Spacer size={30} horizontal={true} />
      {failedSubmissionMessage !== '' && (
        <div style={{ color: '#fc6464', textAlign: 'center' }}>
          <Spacer size={15} horizontal={true} />
          <h5>{t('device.confirm.failure')}</h5>
          <p>{failedSubmissionMessage}</p>
        </div>
      )}
      {isFailedEdit && (
        <div style={{ color: '#fc6464', textAlign: 'center' }}>
          <Spacer size={15} horizontal={true} />
          <h5>{t('device.confirm.invalid_id')}</h5>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={handleEdit}>{t('device.confirm.back_buton')}</Button>
        <div style={{ width: '10vw' }}></div>
        <Button onClick={handleSubmit}>{t('device.confirm.register_button')}</Button>
      </div>
    </>
  );
};
