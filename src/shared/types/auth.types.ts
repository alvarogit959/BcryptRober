export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface JwtPayloadBase {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
