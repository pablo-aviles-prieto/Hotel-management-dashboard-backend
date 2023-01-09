import mongoose from 'mongoose';
import { BookingModel } from '../models';
import { ControllerError } from '../errors';
import { sanitizeDate } from '../utils';
import { Request, Response, NextFunction } from 'express';

export const getBookingsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingsList = await BookingModel.find().populate('roomId');
    if (bookingsList.length === 0) {
      next(new ControllerError({ name: 'Error bookings list', message: `Couldn't find any booking`, status: 404 }));
      return;
    }
    res.status(200).json({ result: bookingsList });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error bookings list',
          message: 'Error getting the bookings list on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error bookings list', message: 'Error getting the bookings list', status: 500 }));
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { orderDate, checkIn, checkOut } = req.body;

  try {
    const booking = new BookingModel({
      ...req.body,
      orderDate: orderDate ? sanitizeDate(orderDate) : new Date().toISOString().substring(0, 10),
      checkIn: sanitizeDate(checkIn),
      checkOut: sanitizeDate(checkOut)
    });

    const result = await booking.save();
    res.status(201).json({ result });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error creating booking',
          message: 'Error creating the booking on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error creating booking', message: 'Error creating the booking', status: 500 }));
  }
};

export const getSingleBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  try {
    const booking = await BookingModel.findById(bookingId).populate('roomId').exec();
    if (!booking)
      return next(
        new ControllerError({
          name: 'Error single booking',
          message: `Couldn't find the selected booking`,
          status: 404
        })
      );
    res.status(200).json({ result: booking });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error single booking',
          message: 'Error getting the booking on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error single booking', message: 'Error getting the booking', status: 500 }));
  }
};

export const editBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  try {
    const existBooking = await BookingModel.findById(bookingId).exec();
    if (!existBooking)
      return next(
        new ControllerError({
          name: 'Error editing booking',
          message: `Couldn't find the selected booking`,
          status: 404
        })
      );

    const sanitizeBookingProps: { [key: string]: Function } = {
      orderDate: (date: string) => sanitizeDate(date),
      checkIn: (date: string) => sanitizeDate(date),
      checkOut: (date: string) => sanitizeDate(date)
    };

    for (const property in req.body) {
      if (sanitizeBookingProps[property]) {
        existBooking[property] = sanitizeBookingProps[property](req.body[property]);
        continue;
      }
      existBooking[property] = req.body[property];
    }

    await existBooking.save();

    res.status(202).json({ result: existBooking });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error editing booking',
          message: 'Error editing the booking on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error editing booking', message: 'Error editing the booking', status: 500 }));
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  try {
    const existBooking = await BookingModel.findById(bookingId).exec();
    if (!existBooking)
      return next(
        new ControllerError({
          name: 'Error deleting booking',
          message: `Couldn't find the selected booking`,
          status: 400
        })
      );

    await existBooking.delete();

    res.status(202).json({ result: 'Booking deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(
        new ControllerError({
          name: 'Error deleting booking',
          message: 'Error deleting the booking on Mongo',
          status: 400,
          additionalMessage: error.message
        })
      );
      return;
    }
    next(new ControllerError({ name: 'Error deleting booking', message: 'Error deleting the booking', status: 500 }));
  }
};
