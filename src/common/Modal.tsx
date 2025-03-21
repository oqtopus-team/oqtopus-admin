import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  message: string;
  execFunction: () => void;
}

const DefaultModal: React.FunctionComponent<ModalProps> = (props) => {
  const { t } = useTranslation();
  const onClick = (): void => {
    props.execFunction();
    // @todo loading display
    props.onHide();
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{t('common.modal.confirm')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClick}>
          {t('common.modal.yes')}
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          {t('common.modal.no')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DefaultModal;
