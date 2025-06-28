import { User } from 'src/modules/users/entities/user.entity';

export interface AuthResponse {
  loggedUser: LoggedUser;
  accessToken: string;
}

export interface LoggedUser {
  id: User['id'];
  fullName: string;
  email: string;
  roles: string[];
}
