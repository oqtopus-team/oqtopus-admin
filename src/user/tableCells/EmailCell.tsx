import { useTranslation } from 'react-i18next';
import { UsersUserStatus } from '../../api/generated';
import Badge from 'react-bootstrap/Badge';
import React from 'react';
import { User } from '../../types/UserType';

interface EmailCellProps {
  user: User;
}

export const EmailCell = ({ user }: EmailCellProps) => {
  const { t } = useTranslation();
  return (
    <div>
      {user.email}
      {user.status === UsersUserStatus.Suspended && (
        <Badge pill bg="secondary" style={{ marginLeft: '10px' }}>
          {t('users.status.suspended')}
        </Badge>
      )}
    </div>
  );
};
