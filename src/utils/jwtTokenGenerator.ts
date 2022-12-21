import { sign } from 'jsonwebtoken';

interface IUser {
  id: number | string;
  email: string;
}

const { JWT_PRIVATE } = process.env;

export const jwtTokenGenerator = (user: IUser) => {
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
