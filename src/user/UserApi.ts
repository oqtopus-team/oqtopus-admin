import { User, UserSearchParams } from '../types/UserType';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';
import { UsersGetOneUserResponse, UsersUserStatus } from '../api/generated';
import { useContext } from 'react';
import { userApiContext } from '../backend/Provider';

const convertToUser = (user: UsersGetOneUserResponse): User => ({
  id: user.id.toString(),
  name: user.name ?? '',
  group_id: user.group_id ?? '',
  email: user.email ?? '',
  organization: user.organization ?? '',
  available_devices:
    user.available_devices === '*'
      ? '*'
      : Array.isArray(user.available_devices)
        ? user.available_devices
        : [],
  status: user.status ?? UsersUserStatus.Suspended, // 要検討
});

const convertToUsersUserStatus = (statusStr?: string): UsersUserStatus | undefined => {
  if (statusStr === 'approved') {
    return UsersUserStatus.Approved;
  } else if (statusStr === 'unapproved') {
    return UsersUserStatus.Unapproved;
  } else if (statusStr === 'suspended') {
    return UsersUserStatus.Suspended;
  }
  return undefined;
};

export const useUserAPI = () => {
  const api = useContext(userApiContext);

  const getUsers = async (
    offset?: number,
    limit?: number,
    sort?: ColumnSort,
    filterFields?: UserSearchParams
  ): Promise<User[]> => {
    const offsetStr = offset != null ? offset.toString() : undefined;
    const limitStr = limit != null ? limit.toString() : undefined;

    const params: Record<string, string> = {};
    if (sort) params['sort'] = `${sort.id},${sort.desc ? 'desc' : 'asc'}`;

    const res = await api.UserApi.getUsers(
      offsetStr,
      limitStr,
      filterFields?.email,
      filterFields?.name,
      filterFields?.organization,
      convertToUsersUserStatus(filterFields?.status),
      filterFields?.group_id,
      { params }
    );
    return res.data.users?.map(convertToUser) ?? [];
  };

  const getUser = async (userId: string): Promise<User | null> => {
    const res = await api.UserApi.getOneUserById(Number(userId));
    return res.data ? convertToUser(res.data) : null;
  };

  const statusChangeUser = async (userId: string, status: UsersUserStatus): Promise<User> => {
    const res = await api.UserApi.updatetUserStatusById(Number(userId), { status });
    return convertToUser(res.data);
  };

  const deleteUser = async (userId: string): Promise<void> => {
    await api.UserApi.deleteUserById(Number(userId));
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    const res = await api.UserApi.updatetUserStatusById(Number(userId), userData);
    return convertToUser(res.data);
  };

  return {
    getUsers,
    getUser,
    statusChangeUser,
    deleteUser,
    updateUser,
  };
};
