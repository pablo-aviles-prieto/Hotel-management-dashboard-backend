import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
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
  res.status(200).json(usersList);
};

export const getSingleUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  const getUser = usersList.find((user) => user.id === +userId);
  res.status(200).json(getUser);
};

export const editUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  const getUser = usersList.find((user) => user.id === +userId);
  res.status(200).json(getUser);
};

export const deleteUser = (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const usersList: IUsers[] = JSON.parse(rawData);
  const newUsersList = usersList.filter((user) => user.id !== +userId);
  res.status(200).json(newUsersList);
};
