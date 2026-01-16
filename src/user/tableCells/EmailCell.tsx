import { useTranslation } from 'react-i18next';
import { UsersUserStatus } from '../../api/generated';
import Badge from 'react-bootstrap/Badge';
import React from 'react';

interface EmailCellProps<T extends { email: string; status?: UsersUserStatus }> {
  user: T;
}

export const EmailCell = <T extends { email: string; status?: UsersUserStatus }>({
  user,
}: EmailCellProps<T>) => {
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
