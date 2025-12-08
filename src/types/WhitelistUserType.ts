type ALL_ITEMS = '*';

export interface WhitelistUser {
  id: string;
  group_id: string;
  email: string;
  username: string;
  organization: string;
  is_signup_completed: boolean;
  available_devices: string[] | ALL_ITEMS;
}

export interface WhitelistUserSearchParams {
  group_id?: string;
  email?: string;
  username?: string;
  organization?: string;
  page?: string;
}

export interface ResponseWhitelistUser {
  NextPage: string;
  MaxPage: string;
  Data: WhitelistUser[];
}

export interface RegisterRequest {
  users: WhitelistUserRequest[];
}

export interface WhitelistUserRequest {
  group_id: string;
  email: string;
  username: string;
  organization: string;
}
