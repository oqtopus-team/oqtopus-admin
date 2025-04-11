import {
  WhitelistUser,
  WhitelistUserRequest,
  WhitelistUserSearchParams,
} from '../types/WhitelistUserType';
import { ApiResponse } from '../types/CommonType';
import { TFunction } from 'i18next';

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

export async function getUsers(
  idToken: string,
  offset: number,
  limit: number
): Promise<WhitelistUser[]> {
  const res = await fetch(`${apiEndpoint}/users?offset=${offset}&limit=${limit}`, {
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

export async function searchUsers(
  params: WhitelistUserSearchParams,
  idToken: string,
  offset: number,
  limit: number
): Promise<WhitelistUser[]> {
  const query = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    query.set(key, val);
  }
  const res = await fetch(
    `${apiEndpoint}/whitelist_users?offset=${offset}&limit=${limit}${
      query.toString() !== '' ? `&${query.toString()}` : ''
    }`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    }
  );
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
