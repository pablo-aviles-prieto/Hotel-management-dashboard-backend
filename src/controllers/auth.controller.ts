import { Request, Response, NextFunction } from 'express';
import { jwtTokenGenerator } from '../utils';
import { UserModel } from '../models';
import { compare } from 'bcryptjs';
import { BaseError } from '../errors/ErrorClass';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userExist = await UserModel.findOne({ email }).exec();
    if (!userExist) return next(new BaseError({ message: 'Check the credentials and try again!', status: 401 }));

    const passwordMatches = await compare(password, userExist?.password);
    if (!passwordMatches) return next(new BaseError({ message: 'Check the credentials and try again!', status: 401 }));

    const parsedUserId = JSON.stringify(userExist._id);
    const token = jwtTokenGenerator({ id: parsedUserId, email });
    res.status(200).json({ token, user: userExist });
  } catch (error) {
    next(new BaseError({ message: 'Error while login user', status: 500 }));
  }
};
