import React, { useRef, useState } from 'react';
import { WhitelistUser } from '../types/WhitelistUserType';
import Button from 'react-bootstrap/Button';
import DefaultModal from '../common/Modal';
import { useAuth } from '../hooks/use-auth';
import { useSetLoading } from '../common/Loader';
import { deleteUser } from './WhitelistUserApi';
import { useTranslation } from 'react-i18next';

const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';
const useOrganization: boolean = import.meta.env.VITE_USE_ORGANIZATION === 'enable';

interface UserProps {
  user: WhitelistUser;
  execFunction: () => Promise<void>;
}

const WhitelistUserListItem: React.FC<UserProps> = (props) => {
  const [user] = useState<WhitelistUser>(props.user);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const auth = useAuth();
  const processing = useRef(false);
  const setLoading = useSetLoading();
  const { t } = useTranslation();

  const onDeleteClick = (): void => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    setLoading(true);
    deleteUser([user.email], auth.idToken, t)
      .then((res) => {
        if (res.success) {
          alert(t('users.white_list.operation.delete_success', { user: user.email }));
          props.execFunction();
        } else {
          alert(t('users.white_list.operation.delete_failure', { user: user.email }));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        processing.current = false;
        setLoading(false);
      });
  };

  return (
    <tr className="">
      <td>{user.group_id}</td>
      <td>{user.email}</td>
      {useUsername ? <td className="text-break">{user.username}</td> : ''}
      {useOrganization ? <td className="text-break">{user.organization}</td> : ''}
      <td className="text-break">
        {user.is_signup_completed
          ? t('users.white_list.is_signup_completed.true')
          : t('users.white_list.is_signup_completed.false')}
      </td>
      <td className="text-break">
        {user.is_signup_completed ? (
          ''
        ) : (
          <>
            <Button className="btn-danger" onClick={() => setDeleteModalShow(true)}>
              {t('users.white_list.operation.delete')}
            </Button>
            <DefaultModal
              show={deleteModalShow}
              onHide={() => setDeleteModalShow(false)}
              message={t('users.white_list.operation.delete_confirm', { user: user.email })}
              execFunction={onDeleteClick}
            />
          </>
        )}
      </td>
    </tr>
  );
};

export default WhitelistUserListItem;
