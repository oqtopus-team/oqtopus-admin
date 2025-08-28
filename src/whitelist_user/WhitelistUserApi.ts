import { WhitelistUser, WhitelistUserRequest } from '../types/WhitelistUserType';
import { ApiResponse } from '../types/CommonType';
import { TFunction } from 'i18next';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';
import { UserSearchParams } from '../types/UserType';

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

export async function getUsers(
  idToken: string,
  options: {
    offset?: number;
    limit?: number;
    sort?: ColumnSort;
    filterFields?: UserSearchParams;
  } = {}
): Promise<WhitelistUser[]> {
  const { offset, limit, sort, filterFields } = options;
  const params = new URLSearchParams();

  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (sort) params.append('sort', `${sort.id},${sort.desc ? 'desc' : 'asc'}`);

  Object.entries(filterFields ?? {}).forEach(([key, value]) => {
    params.append(key, value);
  });

  const res = await fetch(`${apiEndpoint}/whitelist_users?${params.toString()}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  });
  const json = await res.json();
  return json.users;
}

export async function registerUsers(
  whitelist: WhitelistUserRequest[],
  idToken: string,
  t: TFunction<'translation', any>
): Promise<ApiResponse> {
  const res = await fetch(`${apiEndpoint}/whitelist_users`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({ users: whitelist }),
  });

  const body = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: body.message,
    };
  }
  return {
    success: true,
    message: t('users.white_list.register.register_success'),
  };
}

export async function deleteUser(
  userEmails: string[],
  idToken: string,
  t: TFunction<'translation', any>
): Promise<ApiResponse> {
  const res = await fetch(`${apiEndpoint}/whitelist_users`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({ user_emails: userEmails }),
  });

  if (!res.ok) {
    return {
      success: false,
      message: t('users.white_list.operation.delete_failure'),
    };
  }
  return {
    success: true,
    message: t('users.white_list.operation.delete_success'),
  };
}
