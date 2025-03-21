import { useNavigate, useLocation } from 'react-router';
import BaseLayout from '../common/BaseLayout';
import { DeviceForm } from '../types/DeviceType';
import { postDevice } from './DeviceApi';
import { useAuth } from '../hooks/use-auth';
import { Spacer } from '../common/Spacer';
import { DeviceFormConfirm } from './form/DeviceFormConfirm';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

export const DeviceRegisterConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [formData, setFormData] = useState<DeviceForm>();
  const [failedSubmissionMessage, setFailedSubmissionMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('device.register.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    if (location.state != null && (location.state as { formData: DeviceForm }).formData != null) {
      setFormData((location.state as { formData: DeviceForm }).formData);
    } else {
      navigate('/device');
    }
  }, [location, navigate]);

  const handleEdit = (): void => {
    navigate(`/device/form/edit`, location);
  };

  const handleSubmit = async (): Promise<void> => {
    if (formData != null) {
      const res = await postDevice(formData, auth.idToken);
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
    <BaseLayout>
      {formData != null && <DeviceFormConfirm inputData={formData} />}
      <Spacer size={30} horizontal={true} />
      {failedSubmissionMessage !== '' && (
        <div style={{ color: '#fc6464', textAlign: 'center' }}>
          <Spacer size={15} horizontal={true} />
          <h5>{t('device.register.failure')}</h5>
          <p>{failedSubmissionMessage}</p>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={handleEdit}>{t('device.confirm.back_buton')}</Button>
        <div style={{ width: '10vw' }}></div>
        <Button onClick={handleSubmit}>{t('device.confirm.register_button')}</Button>
      </div>
    </BaseLayout>
  );
};
