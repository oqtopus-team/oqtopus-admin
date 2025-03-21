import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import DefaultModal from '../common/Modal';
import { User } from '../types/UserType';
import { statusChangeUser, deleteUser } from './UserApi';
import { useAuth } from '../hooks/use-auth';
import { useSetLoading } from '../common/Loader';
import { useTranslation } from 'react-i18next';

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

  const onStopClick = (isStop: boolean): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    const status = isStop ? 'suspended' : 'approved';
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
        alert(t('users.list.operation.delete_success', {user: user.email}));
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
        {user.status === 'suspended' ? (
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
      <td>
        <Button className="mb-1" variant="danger" onClick={() => setDeleteModalShow(true)}>
          {t('users.list.operation.delete')}
        </Button>{' '}
        <DefaultModal
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          message={t('users.list.operation.delete_confirm', {user: user.email})}
          execFunction={onDeleteClick}
        />
        <Button className="mb-1" variant="secondary" onClick={() => setStopModalShow(true)}>
          {user.status !== 'suspended' ? t('users.list.operation.suspend') : 
                                          t('users.list.operation.unsuspend')}
        </Button>{' '}
        <DefaultModal
          show={stopModalShow}
          onHide={() => setStopModalShow(false)}
          message={
            user.status !== 'suspended'
              ? t('users.list.operation.suspend_confirm', {user: user.email})
              : t('users.list.operation.unsuspend_confirm', {user: user.email})
          }
          execFunction={
            user.status !== 'suspended' ? () => onStopClick(true) : () => onStopClick(false)
          }
        />
      </td>
    </tr>
  );
};

export default UserListItem;
