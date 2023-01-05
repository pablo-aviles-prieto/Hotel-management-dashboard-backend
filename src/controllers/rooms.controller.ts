import { Request, Response, NextFunction } from 'express';
import { RoomModel } from '../models';

export const getRoomsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomsList = await RoomModel.find().exec();
    res.status(200).json({ result: roomsList });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  const {
    images,
    roomName,
    bedType,
    roomNumber,
    roomFloor,
    roomDescription,
    roomType,
    ratePerNight,
    discount,
    facilities,
    status
  } = req.body;

  const room = new RoomModel({
    photo: images,
    roomName,
    bedType,
    roomNumber,
    roomFloor,
    roomDescription,
    roomType,
    ratePerNight,
    facilities,
    status,
    offerPrice: discount
  });

  try {
    const result = await room.save();
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getSingleRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    const user = await RoomModel.findById(roomId).exec();
    if (!user) return res.status(400).json({ result: 'Error fetching the room' });
    res.status(200).json({ result: user });
  } catch (error) {
    next(error);
  }
};

export const editRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    const existRoom = await RoomModel.findById(roomId).exec();
    if (!existRoom) return res.status(400).send({ result: 'Error fetching the room' });

    for (const property in req.body) {
      if (property === 'images') {
        existRoom.photo = req.body.images;
        continue;
      }
      if (property === 'discount') {
        existRoom.offerPrice = req.body.discount;
        continue;
      }
      existRoom[property] = req.body[property];
    }

    await existRoom.save();

    res.status(202).json({ result: existRoom });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    // TODO check if this room is booked and handle it
    const existRoom = await RoomModel.findById(roomId).exec();
    if (!existRoom) return res.status(400).send({ result: 'Error deleting the room' });

    await existRoom.delete();

    res.status(202).json({ result: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
