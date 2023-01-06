import { Request, Response, NextFunction } from 'express';
import { jwtTokenGenerator } from '../utils';
import { UserModel } from '../models';
import { compare } from 'bcryptjs';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userExist = await UserModel.findOne({ email }).exec();
  if (!userExist) {
    res.status(401).json({ error: 'Check the credentials and try again!' });
    return;
  }

  let passwordMatches = null;
  // Gotta try/catch the brypt.compare method since it can crash the app when the password supplied is !== string. (mongoose already handles the error so no need to try/catch it)
  try {
    passwordMatches = await compare(password, userExist?.password);
  } catch (error) {
    res.status(401).json({ error: 'Check the credentials and try again!' });
    return;
  }

  if (!passwordMatches) {
    res.status(401).json({ error: 'Check the credentials and try again!' });
    return;
  }
  const parsedUserId = JSON.stringify(userExist._id);
  const token = jwtTokenGenerator({ id: parsedUserId, email });
  res.status(200).json({ token, user: userExist });
};
