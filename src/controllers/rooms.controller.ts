import { unlink } from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { RoomModel, BookingModel } from '../models';
import { ControllerError } from '../errors';
import { Request, Response, NextFunction } from 'express';
import { IRooms } from '../interfaces';

const { SELF_HOST_URI } = process.env;

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
          message: 'Error getting the rooms list from DB',
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
  if (!req.file) {
    return next(new ControllerError({ name: 'Error creating room', message: `Required photo not found`, status: 400 }));
  }

  try {
    const photoUrl = `${SELF_HOST_URI}/images/${req.file.filename}`;

    const room = new RoomModel({
      ...req.body,
      photo: photoUrl,
      roomNumber: Number(req.body.roomNumber),
      ratePerNight: Number(req.body.ratePerNight),
      facilities: JSON.parse(req.body.facilities),
      offerPrice: Number(req.body.discount)
    });

    const result = await room.save();
    res.status(201).json({ result });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error creating room',
          message: 'Error creating the room on DB',
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
          message: 'Error getting the room from DB',
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
    const existRoom = <IRooms | null>await RoomModel.findById(roomId).exec();
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
      if (property === 'images') continue;

      if (property === 'discount') {
        existRoom.offerPrice = Number(req.body.discount);
        continue;
      }
      if (property === 'roomNumber') {
        existRoom.roomNumber = Number(req.body.roomNumber);
        continue;
      }
      if (property === 'ratePerNight') {
        existRoom.ratePerNight = Number(req.body.ratePerNight);
        continue;
      }
      if (property === 'facilities') {
        existRoom.facilities = JSON.parse(req.body.facilities);
        continue;
      }
      existRoom[property] = req.body[property];
    }

    if (req.file) {
      const fileName = existRoom.photo.replace(`${SELF_HOST_URI}/images/`, '');
      const filePath = `${path.join(__dirname, `../../public/images/${fileName}`)}`;

      unlink(filePath, (err) => {
        if (err) {
          // Even if the server couldn't find the image, I return 202 since its a backend bug and the product was deleted, so I rather return that feedback to the UX.
          console.error(`Room img ${fileName} not found on server!`);
        } else {
          console.info(`Room img ${fileName} deleted from server`);
        }
      });

      existRoom.photo = `${SELF_HOST_URI}/images/${req.file.filename}`;
    }

    await existRoom.save();

    res.status(202).json({ result: existRoom });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error editing room',
          message: 'Error editing the room on DB',
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
    const existRoom = <IRooms | null>await RoomModel.findById(roomId).exec();
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

    const fileName = existRoom.photo.replace(`${SELF_HOST_URI}/images/`, '');
    const filePath = `${path.join(__dirname, `../../public/images/${fileName}`)}`;

    await BookingModel.deleteMany({ roomId: existRoom.id });
    await existRoom.delete();

    unlink(filePath, (err) => {
      if (err) {
        // Even if the server couldn't find the image, I return 202 since its a backend bug and the product was deleted, so I rather return that feedback to the UX.
        console.error(`Room img ${fileName} not found on server!`);
      } else {
        console.info(`Room img ${fileName} deleted from server`);
      }
    });

    res.status(202).json({ result: 'Room and the bookings associated were deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error deleting room',
          message: 'Error deleting the room on DB',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error deleting room', message: 'Error deleting the room', status: 500 }));
  }
};
