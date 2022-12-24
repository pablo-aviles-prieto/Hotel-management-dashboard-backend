import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { IRooms } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/rooms.json');

export const getRoomsList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  // console.log('req.user', req.user);
  res.status(200).json(roomsList);
};

export const createRoom = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  //TODO Check inputs before saving on DB
  //TODO Return the created Obj
  //TODO along with the ID, need to insert the status(availability) and if there is a offer price
  // const offerPrice = objToInsert.checkOffer
  //   ? Number(((objToInsert.ratePerNight * objToInsert.discount) / 100).toFixed(2))
  //   : null;
  res.status(201).json(roomsList);
};

export const getSingleRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  const getRoom = roomsList.find((room) => room.id === +roomId);
  if (!getRoom) {
    res.status(422).end();
    return;
  }
  res.status(200).json(getRoom);
};

export const editRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);
  const getRoom = roomsList.find((room) => room.id === +roomId);

  if (!getRoom) {
    res.status(422).end();
    return;
  }

  //TODO Check inputs before saving on DB

  const newRoomArr = [...roomsList];
  const indexOfObj = newRoomArr.findIndex((obj) => obj.id === +roomId);
  newRoomArr[indexOfObj] = {
    ...newRoomArr[indexOfObj],
    ...req.body
  };

  res.status(202).json(newRoomArr);
};

export const deleteRoom = (req: Request, res: Response, _next: NextFunction) => {
  const { roomId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const roomsList: IRooms[] = JSON.parse(rawData);

  const roomSelected = roomsList.find((room) => room.id === +roomId);

  if (!roomSelected) {
    res.status(422).end();
    return;
  }

  res.status(200).end();
};
