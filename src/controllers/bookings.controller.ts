import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { BookingModel } from '../models';
import { BaseError } from '../errors/ErrorClass';

export const getBookingsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingsList = await BookingModel.find().populate('roomId');
    res.status(200).json({ result: bookingsList });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { orderDate, checkIn, checkOut } = req.body;

  const booking = new BookingModel({
    ...req.body,
    orderDate: orderDate
      ? new Date(orderDate).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10),
    checkIn: new Date(checkIn).toISOString().substring(0, 10),
    checkOut: new Date(checkOut).toISOString().substring(0, 10)
  });

  try {
    const result = await booking.save();
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getSingleBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  try {
    const booking = await BookingModel.findById(bookingId).populate('roomId').exec();
    if (!booking) return res.status(400).json({ result: 'Error fetching the booking' });
    res.status(200).json({ result: booking });
  } catch (error) {
    next(error);
  }
};

export const editBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  const sanitizeDate = (date: string) => new Date(date).toISOString().substring(0, 10);

  try {
    const existBooking = await BookingModel.findById(bookingId).exec();
    if (!existBooking) return res.status(400).send({ result: 'Error fetching the user' });

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
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  try {
    const existBooking = await BookingModel.findById(bookingId).exec();
    if (!existBooking) return next(new BaseError({ message: 'The booking does not exist', status: 400 }));

    await existBooking.delete();

    res.status(202).json({ result: 'Booking deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(new BaseError({ message: 'Error deleting bookings', status: 400, additionalMessage: error.message }));
      return;
    }
    next(new BaseError({ message: 'Generic error deleting booking', status: 500 }));
  }
};
