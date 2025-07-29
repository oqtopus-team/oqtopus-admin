import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import DefaultModal from '../common/Modal';
import { User, UserStatus } from '../types/UserType';
import { deleteUser, statusChangeUser } from './UserApi';
import { useAuth } from '../hooks/use-auth';
import { useSetLoading } from '../common/Loader';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';

interface UserProps {
  user: User;
  execFunction: () => void;
}

const UserListItem: React.FC<UserProps> = (props) => {
  const [user, setUser] = useState<User>(props.user);
  const auth = useAuth();
  const processing = useRef(false);
  const setLoading = useSetLoading();
  const [stopModalShow, setStopModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onStopClick = (isStop: boolean): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    const status = isStop ? UserStatus.SUSPENDED : UserStatus.APPROVED;
    statusChangeUser(user.id, status, auth.idToken)
      .then((res: User) => {
        setUser(res);
        props.execFunction();
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
    deleteUser(user.id, auth.idToken)
      .then(() => {
        alert(t('users.list.operation.delete_success', { user: user.email }));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        props.execFunction();
        processing.current = false;
        setLoading(false);
      });
  };

  return (
    <tr>
      <td>
        {user.email}
        {user.status === UserStatus.SUSPENDED ? (
          <Badge pill bg="secondary">
            {t('users.status.suspended')}
          </Badge>
        ) : (
          ''
        )}
      </td>
      <td>{user.group_id}</td>
      {useUsername ? <td className="text-break">{user.name}</td> : ''}
      {useUsername ? <td className="text-break">{user.organization}</td> : ''}
      <td className="text-break">
        {Array.isArray(user.available_devices) ? (
          user.available_devices.map((deviceId) => (
            <p key={deviceId} className="m-0">
              {deviceId}
            </p>
          ))
        ) : (
          <p className="m-0">{user.available_devices}</p>
        )}
      </td>
      <td>
        <Button className="mb-1 w-100" variant="danger" onClick={() => setDeleteModalShow(true)}>
          {t('users.list.operation.delete')}
        </Button>{' '}
        <DefaultModal
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          message={t('users.list.operation.delete_confirm', { user: user.email })}
          execFunction={onDeleteClick}
        />
        <Button className="mb-1 w-100" variant="secondary" onClick={() => setStopModalShow(true)}>
          {user.status !== UserStatus.SUSPENDED
            ? t('users.list.operation.suspend')
            : t('users.list.operation.unsuspend')}
        </Button>
        <Button
          className="mb-1 w-100"
          variant="primary"
          onClick={() => navigate(`edit/${props.user.id}`)}
        >
          {t('users.list.operation.edit')}
        </Button>
        <DefaultModal
          show={stopModalShow}
          onHide={() => setStopModalShow(false)}
          message={
            user.status !== UserStatus.SUSPENDED
              ? t('users.list.operation.suspend_confirm', { user: user.email })
              : t('users.list.operation.unsuspend_confirm', { user: user.email })
          }
          execFunction={
            user.status !== UserStatus.SUSPENDED
              ? () => onStopClick(true)
              : () => onStopClick(false)
          }
        />
      </td>
    </tr>
  );
};

export default UserListItem;
