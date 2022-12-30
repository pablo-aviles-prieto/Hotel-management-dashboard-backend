import { Request, Response, NextFunction } from 'express';
import { db } from '../data/database';
import { resolve } from 'path';
import { IRoomsRow } from '../interfaces';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getRoomsList = async (req: Request, res: Response, next: NextFunction) => {
  const query = `SELECT * FROM rooms`;
  try {
    const [roomsList] = await db.query<IRoomsRow[]>(query);
    res.status(200).json({ result: roomsList });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  const queryGet = `SELECT * FROM rooms WHERE roomNumber = ?`;
  const queryPost = `INSERT INTO rooms SET ?`;
  const {
    images,
    roomName,
    bedType,
    roomNumber,
    roomFloor,
    roomDescription,
    ratePerNight,
    discount,
    facilities,
    status
  } = req.body;

  const roomToInsertOnDB = {
    photo: images ? images : '',
    roomNumber,
    roomName,
    bedType,
    roomFloor,
    roomDescription,
    facilities: JSON.stringify(facilities),
    ratePerNight,
    status: status ? status : 'Available',
    offerPrice: discount ? discount : null
  };

  try {
    const [roomExist] = await db.query<RowDataPacket[]>(queryGet, parseInt(roomNumber));
    if (roomExist.length > 0) return res.status(400).json({ result: 'Error creating the room' });
    //TODO Check inputs before saving on DB

    const [resultCreatingRoom] = await db.query<OkPacket>(queryPost, roomToInsertOnDB);
    const insertedObj = {
      ...roomToInsertOnDB,
      id: resultCreatingRoom.insertId
    };
    res.status(201).json({ result: insertedObj });
  } catch (error) {
    next(error);
  }
};

export const getSingleRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  const query = `SELECT * FROM rooms WHERE id = ?`;
  try {
    const [getRoom] = await db.query<IRoomsRow[]>(query, parseInt(roomId));
    if (getRoom.length === 0) return res.status(400).json({ result: 'Error fetching the room' });

    res.status(200).json({ result: getRoom[0] });
  } catch (error) {
    next(error);
  }
};

export const editRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  const queryGetUser = `SELECT * FROM rooms WHERE id = ?`;
  const queryEdit = `UPDATE rooms SET ? WHERE id = ?`;
  const {
    images,
    roomName,
    bedType,
    roomNumber,
    roomFloor,
    roomDescription,
    ratePerNight,
    discount,
    facilities,
    status
  } = req.body;

  try {
    const [getRoom] = await db.query<RowDataPacket[]>(queryGetUser, parseInt(roomId));
    if (getRoom.length === 0) return res.status(400).json({ result: 'Error editing the room' });

    const roomToUpdateOnDB = {
      photo: images ? images : getRoom[0].photo,
      roomNumber: roomNumber ? roomNumber : getRoom[0].roomNumber,
      roomName: roomName ? roomName : getRoom[0].roomName,
      bedType: bedType ? bedType : getRoom[0].bedType,
      roomFloor: roomFloor ? roomFloor : getRoom[0].roomFloor,
      roomDescription: roomDescription ? roomDescription : getRoom[0].roomDescription,
      facilities:
        facilities?.length > 0 ? JSON.stringify(facilities) : JSON.stringify(getRoom[0].facilities),
      ratePerNight: ratePerNight ? ratePerNight : getRoom[0].ratePerNight,
      status: status ? status : getRoom[0].status,
      offerPrice: discount ? discount : getRoom[0].offerPrice
    };

    await db.query<OkPacket>(queryEdit, [roomToUpdateOnDB, parseInt(roomId)]);
    res.status(202).json({ result: 'Room updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  const query = `DELETE FROM rooms WHERE id = ?`;
  try {
    const [result] = await db.query<OkPacket>(query, parseInt(roomId));
    if (result.affectedRows === 0) {
      return res.status(404).json({ result: 'Error deleting the selected room' });
    }

    res.status(202).json({ result: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
