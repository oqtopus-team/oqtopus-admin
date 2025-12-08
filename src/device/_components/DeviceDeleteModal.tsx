import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useDeviceAPI } from '../../device/DeviceApi';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationProps {
  showModal: boolean;
  hideModal: () => void;
  deviceId?: string;
  idToken?: string;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  showModal,
  hideModal,
  deviceId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { deleteDevice } = useDeviceAPI();

  const handleDelete = async (deviceId?: string): Promise<void> => {
    if (deviceId !== undefined) {
      const res = await deleteDevice(deviceId);
      if (res.success) {
        navigate('/device', { replace: true });
      } else {
        console.error('Error deleting device:', res.message);
      }
    } else {
      console.error('Device ID is undefined');
    }
  };

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger" style={{ whiteSpace: 'pre-wrap' }}>
          {t('device.delete.confirm', { device_id: deviceId })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            await handleDelete(deviceId);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
