import { WhitelistUsersListWhitelistUserResponse } from "../api/generated";

type ALL_ITEMS = '*';

export interface WhitelistUser {
  id: WhitelistUsersListWhitelistUserResponse["id"];
  group_id: WhitelistUsersListWhitelistUserResponse["group_id"];
  email: WhitelistUsersListWhitelistUserResponse["email"];
  display_name: WhitelistUsersListWhitelistUserResponse["display_name"];
  organization: WhitelistUsersListWhitelistUserResponse["organization"];
  is_signup_completed: WhitelistUsersListWhitelistUserResponse["is_signup_completed"];
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
  available_devices?: string[] | ALL_ITEMS;
}
