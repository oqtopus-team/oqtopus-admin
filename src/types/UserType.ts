export enum UserStatus {
  APPROVED = 'approved',
  UNAPPROVED = 'unapproved',
  SUSPENDED = 'suspended',
}

export interface User {
  id: string;
  name: string;
  group_id: string;
  email: string;
  organization: string;
  available_devices: string[];
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
