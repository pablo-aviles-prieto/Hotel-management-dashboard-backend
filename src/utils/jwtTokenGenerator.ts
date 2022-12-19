import { sign } from 'jsonwebtoken';

const { JWT_PRIVATE } = process.env;

export const jwtTokenGenerator = (user: any) =>
  sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_PRIVATE!
  );
