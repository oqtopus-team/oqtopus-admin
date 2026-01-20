import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import DefaultModal from '../../common/Modal';
import { UsersUserStatus } from '../../api/generated';
import { successToastConfig } from '../../config/toast-notification';
import { useSetLoading } from '../../common/Loader';
import { useNavigate } from 'react-router';
import { useUserAPI } from '../UserApi';

interface OperationsCellProps<T extends { id: string; email: string; status?: UsersUserStatus }> {
  user: T;
  isEditable?: boolean;
  execFunctions: {
    delete: (userId: string) => void;
    changeStatus?: (userId: string, status: UsersUserStatus) => void;
  };
}

export const OperationsCell = <T extends { id: string; email: string; status?: UsersUserStatus }>({
  execFunctions,
  user,
  isEditable = true,
}: OperationsCellProps<T>) => {
  const { t } = useTranslation();
  const [stopModalShow, setStopModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const processing = useRef(false);
  const navigate = useNavigate();

  const { statusChangeUser, deleteUser } = useUserAPI();
  const setLoading = useSetLoading();

  const onSuspendClick = (isStop: boolean): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    const status = isStop ? UsersUserStatus.Suspended : UsersUserStatus.Approved;
    statusChangeUser(user.id, status)
      .then(() => {
        toast(
          t('users.list.operation.status_change_success', { user: user.email }),
          successToastConfig
        );
        execFunctions.changeStatus?.(user.id, status);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        processing.current = false;
        setLoading(false);
      });
  };

  const onDeleteClick = (): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    deleteUser(user.id)
      .then(() => {
        toast(t('users.list.operation.delete_success', { user: user.email }), successToastConfig);
        execFunctions.delete(user.id);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        processing.current = false;
        console.log('loading false');
        setLoading(false);
      });
  };

  return (
    <div className="d-flex">
      <Button className="mx-1 w-100" variant="danger" onClick={() => setDeleteModalShow(true)}>
        {t('users.list.operation.delete')}
      </Button>{' '}
      <DefaultModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        message={t('users.list.operation.delete_confirm', { user: user.email })}
        execFunction={onDeleteClick}
      />
      {Boolean(user.status) && (
        <Button className="mx-1 w-100" variant="secondary" onClick={() => setStopModalShow(true)}>
          {user.status !== UsersUserStatus.Suspended
            ? t('users.list.operation.suspend')
            : t('users.list.operation.unsuspend')}
        </Button>
      )}
      {isEditable && (
        <Button
          className="mx-1 w-100"
          variant="primary"
          onClick={() => navigate(`edit/${user.id}`)}
        >
          {t('users.list.operation.edit')}
        </Button>
      )}
      <DefaultModal
        show={stopModalShow}
        onHide={() => setStopModalShow(false)}
        message={
          user.status !== UsersUserStatus.Suspended
            ? t('users.list.operation.suspend_confirm', { user: user.email })
            : t('users.list.operation.unsuspend_confirm', { user: user.email })
        }
        execFunction={
          user.status !== UsersUserStatus.Suspended
            ? () => onSuspendClick(true)
            : () => onSuspendClick(false)
        }
      />
    </div>
  );
};
