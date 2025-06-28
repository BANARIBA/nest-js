export interface JWTPayload {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}
