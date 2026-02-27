import { WhitelistUser, WhitelistUserRequest } from '../types/WhitelistUserType';
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

    const res = await api.WhitelistUsersApi.listWhitelistUsers(offsetStr, limitStr, { params });
    return res.data.users?.map(convertWhitelistUserResult) ?? [];
  };

  const registerUsers = async (whitelist: Partial<WhitelistUserRequest>[]): Promise<void> => {
    await api.WhitelistUsersApi.registerWhitelistUser({ users: whitelist });
  };

  const deleteUser = async (userEmails: string[]): Promise<void> => {
    await api.WhitelistUsersApi.deleteWhitelistUser({ user_emails: userEmails });
  };

  return {
    getUsers,
    registerUsers,
    deleteUser,
  };
};
