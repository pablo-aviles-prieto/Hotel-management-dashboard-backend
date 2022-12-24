import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';
import { IUsers } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/users.json');

export const getUsersList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  res.status(200).json(usersList);
};

export const createUser = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  //TODO Check inputs before saving on DB
  //TODO Return the created Obj
  res.status(201).json(usersList);
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
