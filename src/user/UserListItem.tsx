import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import DefaultModal from '../common/Modal';
import { User } from '../types/UserType';
import { UsersUserStatus } from '../api/generated';
import { useUserAPI } from './UserApi';
import { useSetLoading } from '../common/Loader';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';

interface UserProps {
  user: User;
  execFunction: (userId: string) => void;
}

const UserListItem: React.FC<UserProps> = (props) => {
  const [user, setUser] = useState<User>(props.user);
  const processing = useRef(false);
  const setLoading = useSetLoading();
  const [stopModalShow, setStopModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { statusChangeUser, deleteUser } = useUserAPI();

  const onStopClick = (isStop: boolean): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    const status = isStop ? UsersUserStatus.Suspended : UsersUserStatus.Approved;
    statusChangeUser(user.id, status)
      .then((res: User) => {
        setUser(res);
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
        alert(t('users.list.operation.delete_success', { user: user.email }));
        props.execFunction(user.id);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        processing.current = false;
        setLoading(false);
      });
  };

  return (
    <tr>
      <td>
        {user.email}
        {user.status === UsersUserStatus.Suspended ? (
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
          {user.status !== UsersUserStatus.Suspended
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
            user.status !== UsersUserStatus.Suspended
              ? t('users.list.operation.suspend_confirm', { user: user.email })
              : t('users.list.operation.unsuspend_confirm', { user: user.email })
          }
          execFunction={
            user.status !== UsersUserStatus.Suspended
              ? () => onStopClick(true)
              : () => onStopClick(false)
          }
        />
      </td>
    </tr>
  );
};

export default UserListItem;
