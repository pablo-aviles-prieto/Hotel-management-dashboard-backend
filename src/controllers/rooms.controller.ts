import mongoose from 'mongoose';
import { RoomModel, BookingModel } from '../models';
import { ControllerError } from '../errors';
import { Request, Response, NextFunction } from 'express';

export const getRoomsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomsList = await RoomModel.find().exec();
    if (roomsList.length === 0) {
      next(new ControllerError({ name: 'Error rooms list', message: `Couldn't find any room`, status: 404 }));
      return;
    }
    res.status(200).json({ result: roomsList });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error rooms list',
          message: 'Error getting the rooms list on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error rooms list', message: 'Error getting the rooms list', status: 500 }));
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

  try {
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

    const result = await room.save();
    res.status(201).json({ result });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error creating room',
          message: 'Error creating the room on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error creating room', message: 'Error creating the room', status: 500 }));
  }
};

export const getSingleRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    const room = await RoomModel.findById(roomId).exec();
    if (!room) {
      next(
        new ControllerError({
          name: 'Error single room',
          message: `Couldn't find the selected room`,
          status: 404
        })
      );
      return;
    }
    res.status(200).json({ result: room });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error single room',
          message: 'Error getting the room on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error single room', message: 'Error getting the room', status: 500 }));
  }
};

export const editRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    const existRoom = await RoomModel.findById(roomId).exec();
    if (!existRoom) {
      next(
        new ControllerError({
          name: 'Error editing room',
          message: `Couldn't find the selected room`,
          status: 404
        })
      );
      return;
    }

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
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error editing room',
          message: 'Error editing the room on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error editing room', message: 'Error editing the room', status: 500 }));
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;

  try {
    const existRoom = await RoomModel.findById(roomId).exec();
    if (!existRoom) {
      next(
        new ControllerError({
          name: 'Error deleting room',
          message: `Couldn't find the selected room`,
          status: 400
        })
      );
      return;
    }

    await BookingModel.deleteMany({ roomId: existRoom.id });
    await existRoom.delete();

    res.status(202).json({ result: 'Room and the bookings associated were deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error deleting room',
          message: 'Error deleting the room on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error deleting room', message: 'Error deleting the room', status: 500 }));
  }
};
