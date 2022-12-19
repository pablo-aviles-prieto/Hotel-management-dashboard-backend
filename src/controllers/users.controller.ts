import { Request, Response, NextFunction } from 'express';
import { jwtTokenGenerator } from '../utils';

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  // TODO if user exists
  // TODO if hashed password matches

  const token = jwtTokenGenerator({ id: 0, email });

  res.status(200).json({ token });
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // TODO if email matches
  // TODO if hashed password matches
  if (email !== 'test@test.com') return res.status(400).send('Not my hardcoded user');

  const token = jwtTokenGenerator({ id: 0, email });
  res.status(200).json({ token });
};
