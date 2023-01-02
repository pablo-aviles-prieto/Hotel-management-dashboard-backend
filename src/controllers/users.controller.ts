import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';
import { hashSync } from 'bcryptjs';
import { UserModel } from '../models';
import { IUsers } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/users.json');
const { BCRYPT_SALT } = process.env;

export const getUsersList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  res.status(200).json(usersList);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { photo, name, email, password, startDate, job, contact, status }: IUsers = req.body;

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

export const getSingleUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  const getUser = usersList.find((user) => user.id === +userId);
  if (!getUser) {
    res.status(422).end();
    return;
  }
  res.status(200).json(getUser);
};

export const editUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  const getUser = usersList.find((user) => user.id === +userId);

  if (!getUser) {
    res.status(422).end();
    return;
  }

  //TODO Check inputs before saving on DB

  const newBookingsArr = [...usersList];
  const indexOfObj = newBookingsArr.findIndex((obj) => obj.id === +userId);
  newBookingsArr[indexOfObj] = {
    ...newBookingsArr[indexOfObj],
    ...req.body
  };

  res.status(202).json(newBookingsArr);
};

export const deleteUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);

  const userSelected = usersList.find((user) => user.id === +userId);

  if (!userSelected) {
    res.status(422).end();
    return;
  }

  res.status(204).end();
};
