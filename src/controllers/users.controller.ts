import { Request, Response, NextFunction } from 'express';
import { hashSync } from 'bcryptjs';
import { UserModel } from '../models';

const { BCRYPT_SALT } = process.env;

export const getUsersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await UserModel.find().exec();
    res.status(200).json({ result: usersList });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { photo, name, email, password, startDate, job, contact, status } = req.body;

  const existingUserByEmail = await UserModel.findOne({ email }).exec();
  if (existingUserByEmail) return res.status(400).json({ result: 'Error creating the user' });

  const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
  const hashedPassword = hashSync(password, salt);

  const user = new UserModel({
    photo,
    name,
    email,
    password: hashedPassword,
    startDate,
    job,
    contact,
    status
  });

  try {
    const result = await user.save();
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).exec();
    if (!user) return res.status(400).json({ result: 'Error fetching the user' });
    res.status(200).json({ result: user });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const existUser = await UserModel.findById(userId).exec();
    if (!existUser) return res.status(400).send({ result: 'Error fetching the user' });

    for (const property in req.body) {
      existUser[property] = req.body[property];
    }

    if (password) {
      const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
      const hashedPassword = hashSync(password, salt);
      existUser.password = hashedPassword;
    }

    await existUser.save();

    res.status(202).json({ result: existUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const existUser = await UserModel.findById(userId).exec();
    if (!existUser) return res.status(400).send({ result: 'Error deleting the user' });

    await existUser.delete();

    res.status(202).json({ result: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
