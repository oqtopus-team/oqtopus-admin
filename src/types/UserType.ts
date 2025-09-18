import { UsersUserStatus } from '../api/generated';
type ALL_ITEMS = '*';

export interface User {
  id: string;
  name: string;
  group_id: string;
  email: string;
  organization: string;
  available_devices: string[] | ALL_ITEMS;
  status: UsersUserStatus;
}

export interface UserSearchParams {
  name?: string;
  email?: string;
  group_id?: string;
  organization?: string;
  status?: string;
}
