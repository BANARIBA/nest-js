export interface IUser {
  name: string;
  email: string;
  password?: string;
  is_active: true;
  is_google: boolean;
  avatar: string;
}