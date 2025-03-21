export type UserStatus = 'approved' | 'unapproved' | 'suspended';

export interface User {
  id: string;
  name: string;
  group_id: string;
  email: string;
  organization: string;
  status: UserStatus;
}

export interface UserSearchParams {
  name?: string;
  email?: string;
  group_id?: string;
  organization?: string;
  status?: string;
  page?: string;
}

export interface ResponseUser {
  NextPage: string;
  MaxPage: string;
  Data: User[];
}
