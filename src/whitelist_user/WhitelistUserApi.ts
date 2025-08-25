import { WhitelistUser, WhitelistUserRequest } from '../types/WhitelistUserType';
import { TFunction } from 'i18next';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';
import { useContext } from 'react';
import { UserSearchParams } from '../types/UserType';
import { userApiContext } from '../backend/Provider';
import { WhitelistUsersListWhitelistUserResponse } from '../api/generated';

const convertWhitelistUserResult = (
  user: WhitelistUsersListWhitelistUserResponse
): WhitelistUser => ({
  id: user.id.toString(),
  group_id: user.group_id ?? '',
  email: user.email ?? '',
  username: user.username ?? '',
  organization: user.organization ?? '',
  is_signup_completed: user.is_signup_completed ?? false,
  available_devices:
    user.available_devices === '*'
      ? '*'
      : Array.isArray(user.available_devices)
      ? user.available_devices
      : [],
});

export const useWhitelistUserAPI = () => {
  const api = useContext(userApiContext);

  const getUsers = async (
    offset?: number,
    limit?: number,
    sort?: ColumnSort,
    filterFields?: UserSearchParams
  ): Promise<WhitelistUser[]> => {
    const offsetStr = offset != null ? offset.toString() : undefined;
    const limitStr = limit != null ? limit.toString() : undefined;

    const params: Record<string, string> = {};
    if (sort) params['sort'] = `${sort.id},${sort.desc ? 'desc' : 'asc'}`;

    if (filterFields) {
      for (const [key, value] of Object.entries(filterFields)) {
        if (value !== undefined && value !== null) {
          params[key] = String(value);
        }
      }
    }

    try {
      const res = await api.WhitelistUsersApi.listWhitelistUsers(offsetStr, limitStr, { params });
      return res.data.users?.map(convertWhitelistUserResult) ?? [];
    } catch (e) {
      console.error('Error fetching whitelist users:', e);
      return [];
    }
  };

  const registerUsers = async (
    whitelist: WhitelistUserRequest[],
    t: TFunction<'translation', any>
  ) => {
    try {
      const res = await api.WhitelistUsersApi.registerWhitelistUser({ users: whitelist });
      if (res.status !== 200) {
        return {
          success: false,
          message: t('users.white_list.register.register_failure'),
        };
      }
      return {
        success: true,
        message: t('users.white_list.register.register_success'),
      };
    } catch (e) {
      console.error('Error registering whitelist users:', e);
      return {
        success: false,
        message: t('users.white_list.register.register_failure'),
      };
    }
  };

  const deleteUser = async (userEmails: string[], t: TFunction<'translation', any>) => {
    try {
      const res = await api.WhitelistUsersApi.deleteWhitelistUser({
        user_emails: userEmails,
      });
      if (res.status !== 204) {
        return {
          success: false,
          message: t('users.white_list.operation.delete_failure'),
        };
      }
      return {
        success: true,
        message: t('users.white_list.operation.delete_success'),
      };
    } catch (e) {
      console.error('Error deleting whitelist user:', e);
      return {
        success: false,
        message: t('users.white_list.operation.delete_failure'),
      };
    }
  };

  return {
    getUsers,
    registerUsers,
    deleteUser,
  };
};
