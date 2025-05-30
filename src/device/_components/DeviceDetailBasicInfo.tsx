import { Device } from '../../types/DeviceType';
import { DeviceStatus } from './DeviceStatus';
import Card from 'react-bootstrap/Card';
import { useTranslation } from 'react-i18next';
import { DateTimeFormatter } from '../common/DateTimeFormatter';

export const DeviceDetailBasicInfo: React.FC<Device> = (device) => {
  const { t, i18n } = useTranslation();
  return (
    <Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          rowGap: '5vh',
          columnGap: '1vw',
          padding: '1vw',
        }}
      >
        <div>
          <p>{t('device.id')}</p>
          <h5>{device.id}</h5>
        </div>
        <div>
          <p>{t('device.status')}</p>
          <h5>{DeviceStatus({ status: device.status })}</h5>
        </div>
        <div>
          <p>{t('device.qubits')}</p>
          <h5>{device.nQubits}</h5>
        </div>
        <div>
          <p>{t('device.device_type')}</p>
          <h5>{device.deviceType}</h5>
        </div>
        <div>
          <p>{t('device.available_at')}</p>
          <h5>{DateTimeFormatter(t, i18n, device.availableAt)}</h5>
        </div>
        <div>
          <p>{t('device.calibrated_at')}</p>
          <h5>{DateTimeFormatter(t, i18n, device.calibratedAt)}</h5>
        </div>
        {device.basisGates.length !== 0 && (
          <div>
            <p>{t('device.basis_gates')}</p>
            <h5>{device.basisGates.toString()}</h5>
          </div>
        )}
        {device.supportedInstructions.length !== 0 && (
          <div>
            <p>{t('device.instructions')}</p>
            <h5>{device.supportedInstructions.toString()}</h5>
          </div>
        )}
        <div>
          <p>{t('device.description')}</p>
          <h5>{device.description}</h5>
        </div>
      </div>
    </Card>
  );
};
