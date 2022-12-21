import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { IRooms } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/rooms.json');

export const getRoomsList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  console.log('req.user', req.user);
  res.status(200).json(roomsList);
};

export const createRoom = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  console.log('req.user', req.user);
  res.status(200).json(roomsList);
};

export const getSingleRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  const getRoom = roomsList.find((room) => room.id === +roomId);
  res.status(200).json(getRoom);
};

export const editRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  const getRoom = roomsList.find((room) => room.id === +roomId);
  res.status(200).json(getRoom);
};

export const deleteRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  const newRoomsList = roomsList.filter((room) => room.id !== +roomId);
  res.status(200).json(newRoomsList);
};
