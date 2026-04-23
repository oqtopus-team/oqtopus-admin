import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import DefaultModal from '../common/Modal';
import { UsersUserStatus, WhitelistUsersListWhitelistUserResponse, WhitelistUsersListWhitelistUsersResponse } from '../api/generated';
import { errorToastConfig, successToastConfig } from '../config/toast-notification';
import { useSetLoading } from '../common/Loader';
import { useNavigate } from 'react-router';
import { useWhitelistUserAPI } from './WhitelistUserApi';

type WhitelistUserId = WhitelistUsersListWhitelistUserResponse["id"];

interface OperationsCellProps {
  whitelistUser: WhitelistUsersListWhitelistUserResponse;
  onDeleteSucceeded: (id: WhitelistUserId) => void;
}

export const OperationsCell: React.FC<OperationsCellProps> = ({
  whitelistUser,
  onDeleteSucceeded,
}) => {
  const { t } = useTranslation();
  const [stopModalShow, setStopModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const processing = useRef(false);
  const navigate = useNavigate();

  const whitelistUsersApi = useWhitelistUserAPI();
  const setLoading = useSetLoading();

  const handleDeleteClick = async (): Promise<void> => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    try {
      const resp = await whitelistUsersApi.deleteUser([whitelistUser.email], t);
      if (resp.success) {
        toast(t('users.list.operation.delete_success', { user: whitelistUser.email }), successToastConfig);
        onDeleteSucceeded(whitelistUser.id);
      }
      else {
        toast(t('users.list.operation.delete_failure', { user: whitelistUser.email }), errorToastConfig); 
        console.error(resp.message);
      }
    }
    finally {
      processing.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Button className="mx-1 w-100" variant="danger" onClick={() => setDeleteModalShow(true)}>
        {t('users.list.operation.delete')}
      </Button>{' '}
      <DefaultModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        message={t('users.list.operation.delete_confirm', { user: whitelistUser.email })}
        execFunction={handleDeleteClick}
      />
    </div>
  );
};
