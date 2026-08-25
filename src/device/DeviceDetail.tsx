import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDeviceAPI } from '../device/DeviceApi';
import { useAuth } from '../hooks/use-auth';
import { Device, DeviceInfoHistoryDetail } from '../types/DeviceType';
import { useNavigate } from 'react-router';
import { DeviceDetailBasicInfo } from './_components/DeviceDetailBasicInfo';
import { TopologyInfo } from './_components/TopologyInfo';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { DeleteConfirmation } from './_components/DeviceDeleteModal';
import { useTranslation } from 'react-i18next';
import { DateTimeFormatter } from './common/DateTimeFormatter';

const appName: string = import.meta.env.VITE_APP_NAME;

export const DeviceDetail: React.FC = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState<Device>();
  const [historyDetail, setHistoryDetail] = useState<DeviceInfoHistoryDetail>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const { getDevice, getDeviceHistory } = useDeviceAPI();
  const requestedDeviceHistoryId = searchParams.get('deviceHistoryId') ?? '';

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = `${t('device.detail.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    if (deviceId !== undefined) {
      setHistoryDetail(undefined);
      getDevice(deviceId)
        .then(async (device) => {
          setDevice(device);
          if (requestedDeviceHistoryId) {
            const history = await getDeviceHistory(requestedDeviceHistoryId);
            setHistoryDetail(history);
          }
        })
        .catch(() => {});
    }
  }, [deviceId, requestedDeviceHistoryId, auth.idToken]);

  const handleEdit = (): void => {
    if (deviceId === undefined) {
      console.error('Device ID is undefined');
      return;
    }
    navigate(`/device/form/${deviceId}/edit`);
  };

  return (
    <div className="vertical-scrollable-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button onClick={handleEdit} className="mx-2">
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Delete
        </Button>
      </div>
      {device != null && <DeviceDetailBasicInfo {...device} />}
      <DeleteConfirmation
        showModal={showModal}
        hideModal={() => setShowModal(false)}
        deviceId={deviceId}
      />
      {historyDetail !== undefined && (
        <Card className="mt-3">
          <Card.Body>
            {t('device.history.showing_history', {
              calibrated_at: DateTimeFormatter(t, i18n, historyDetail.calibratedAt),
              interpolation: { escapeValue: false },
            })}
          </Card.Body>
        </Card>
      )}
      {device?.deviceType === 'QPU' && (
        <TopologyInfo deviceInfo={historyDetail?.deviceInfo ?? device?.deviceInfo} />
      )}
    </div>
  );
};
