import { User, UserSearchParams, UserStatus } from '../types/UserType';

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

const commonRequestParams = (idToken: string): Partial<RequestInit> => ({
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    Authorization: 'Bearer ' + idToken,
  },
});

export async function getUsers(idToken: string, offset: number, limit: number): Promise<User[]> {
  const res = await fetch(
    `${apiEndpoint}/users?offset=${offset}&limit=${limit}`,
    commonRequestParams(idToken)
  );
  const json = await res.json();
  return json.users;
}

export async function getUser(idToken: string, userId: string): Promise<User> {
  const res = await fetch(`${apiEndpoint}/users/${userId}`, commonRequestParams(idToken));
  return await res.json();
}

export async function searchUsers(
  params: UserSearchParams,
  idToken: string,
  offset: number,
  limit: number
): Promise<User[]> {
  const query = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    query.set(key, val);
  }
  const res = await fetch(
    `${apiEndpoint}/users?offset=${offset}&limit=${limit}${
      query.toString() !== '' ? `&${query.toString()}` : ''
    }`,
    commonRequestParams(idToken)
  );
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
    ...commonRequestParams(idToken),
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}

export async function deleteUser(userId: string, idToken: string): Promise<boolean> {
  await fetch(`${apiEndpoint}/users/${userId}`, {
    ...commonRequestParams(idToken),
    method: 'DELETE',
  });
  return true;
}

export async function updateUser(
  idToken: string,
  userId: string,
  userData: Partial<User>
): Promise<User> {
  const response = await fetch(`${apiEndpoint}/users/${userId}`, {
    ...commonRequestParams(idToken),
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

  return response.json();
}
