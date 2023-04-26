export interface UserAuth {
  email: string;
  userId: string;
}
export interface AuthLogin {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  auto_login: boolean;
}
