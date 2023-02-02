import { unlink } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { hashSync } from 'bcryptjs';
import { UserModel } from '../models';
import { ControllerError } from '../errors';
import { Request, Response, NextFunction } from 'express';
import { IUsers } from '../interfaces';

const { BCRYPT_SALT, SELF_HOST_URI } = process.env;

export const getUsersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await UserModel.find().exec();
    if (usersList.length === 0) {
      next(new ControllerError({ name: 'Error users list', message: `Couldn't find any user`, status: 404 }));
      return;
    }
    res.status(200).json({ result: usersList });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error users list',
          message: 'Error getting the users list from DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error users list', message: 'Error getting the users list', status: 500 }));
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!req.file) {
    return next(new ControllerError({ name: 'Error creating user', message: `Required photo not found`, status: 400 }));
  }

  try {
    const existingUserByEmail = await UserModel.findOne({ email }).exec();
    if (existingUserByEmail) {
      return next(
        new ControllerError({ name: 'Error creating user', message: `Email already registered`, status: 409 })
      );
    }

    const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
    const hashedPassword = hashSync(password, salt);

    const url = `${SELF_HOST_URI}/images/${req.file.filename}`;
    const parsedJob = JSON.parse(req.body.job);

    const user = new UserModel({
      ...req.body,
      job: parsedJob,
      photo: url,
      password: hashedPassword
    });

    const result = await user.save();
    res.status(201).json({ result });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error creating user',
          message: 'Error creating the user on DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error creating user', message: 'Error creating the user', status: 500 }));
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      next(
        new ControllerError({
          name: 'Error single user',
          message: `Couldn't find the selected user`,
          status: 404
        })
      );
      return;
    }
    res.status(200).json({ result: user });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error single user',
          message: 'Error getting the user from DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error single user', message: 'Error getting the user', status: 500 }));
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const existUser = <IUsers | null>await UserModel.findById(userId).exec();

    if (!existUser) {
      next(
        new ControllerError({
          name: 'Error editing user',
          message: `Couldn't find the selected user`,
          status: 404
        })
      );
      return;
    }

    if (existUser.email === 'hotel@miranda.com') {
      next(
        new ControllerError({
          name: 'Error editing root user',
          message: `This user is not editable!`,
          status: 409
        })
      );
      return;
    }

    for (const property in req.body) {
      if (property === 'job') {
        const parsedJob = JSON.parse(req.body.job);
        const newJobProps = {
          ...existUser.job,
          ...parsedJob
        };
        existUser.job = newJobProps;
        continue;
      }
      if (property === 'password') {
        if (!password) continue; // password can be null
        const salt = BCRYPT_SALT ? Number(BCRYPT_SALT) : 12;
        const hashedPassword = hashSync(password, salt);
        existUser.password = hashedPassword;
        continue;
      }
      if (property === 'photo') continue;
      existUser[property] = req.body[property];
    }

    if (req.file) {
      const fileName = existUser.photo.replace(`${SELF_HOST_URI}/images/`, '');
      const filePath = `${path.join(__dirname, `../../public/images/${fileName}`)}`;

      unlink(filePath, (err) => {
        if (err) {
          // Even if the server couldn't find the image, I return 202 since its a backend bug and the product was deleted, so I rather return that feedback to the UX.
          console.error(`${fileName} not found on server!`);
        } else {
          console.info(`${fileName} deleted from server`);
        }
      });

      existUser.photo = `${SELF_HOST_URI}/images/${req.file.filename}`;
    }

    await existUser.save();

    res.status(202).json({ result: existUser });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error editing user',
          message: 'Error editing the user on DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error editing user', message: 'Error editing the user', status: 500 }));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const existUser = <IUsers | null>await UserModel.findById(userId).exec();

    if (!existUser) {
      next(
        new ControllerError({
          name: 'Error deleting user',
          message: `Couldn't find the selected user`,
          status: 400
        })
      );
      return;
    }

    if (existUser.email === 'hotel@miranda.com') {
      next(
        new ControllerError({
          name: 'Error deleting root user',
          message: `This user is not deletable!`,
          status: 409
        })
      );
      return;
    }

    const fileName = existUser.photo.replace(`${SELF_HOST_URI}/images/`, '');
    const filePath = `${path.join(__dirname, `../../public/images/${fileName}`)}`;

    await existUser.delete();

    unlink(filePath, (err) => {
      if (err) {
        // Even if the server couldn't find the image, I return 202 since its a backend bug and the product was deleted, so I rather return that feedback to the UX.
        console.error(`${fileName} not found on server!`);
      } else {
        console.info(`${fileName} deleted from server`);
      }
    });

    res.status(202).json({ result: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error deleting user',
          message: 'Error deleting the user on DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error deleting user', message: 'Error deleting the user', status: 500 }));
  }
};
