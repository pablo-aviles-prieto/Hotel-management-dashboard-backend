import { sign } from 'jsonwebtoken';

export interface IJWTUser {
  id: number | string;
  email: string;
}

const { JWT_PRIVATE } = process.env;

export const jwtTokenGenerator = (user: IJWTUser): (string | null) => {
  return JWT_PRIVATE
    ? sign(
        {
          id: user.id,
          email: user.email
        },
        JWT_PRIVATE
      )
    : null;
};
