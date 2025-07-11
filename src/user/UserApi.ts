import { User, UserSearchParams, UserStatus } from '../types/UserType';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

export async function getUsers(
  idToken: string,
  options: {
    offset?: number;
    limit?: number;
    sort?: ColumnSort;
    filterFields?: UserSearchParams;
  } = {}
): Promise<User[]> {
  const { offset, limit, sort, filterFields } = options;
  const params = new URLSearchParams();

  if (offset !== undefined) params.append('offset', offset.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (sort) params.append('sort', `${sort.id},${sort.desc ? 'desc' : 'asc'}`);

  Object.entries(filterFields ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const res = await fetch(`${apiEndpoint}/users?${params.toString()}`, {
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

export async function statusChangeUser(
  userId: string,
  status: UserStatus,
  idToken: string
): Promise<User> {
  const data = {
    status: status.toString(),
  };
  const res = await fetch(`${apiEndpoint}/users/${userId}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}

export async function deleteUser(userId: string, idToken: string): Promise<boolean> {
  await fetch(`${apiEndpoint}/users/${userId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  });
  return true;
}
