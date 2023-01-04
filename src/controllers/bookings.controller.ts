import { Request, Response, NextFunction } from 'express';
import { BookingModel } from '../models';

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

  try {
    const existBooking = await BookingModel.findById(bookingId).exec();
    if (!existBooking) return res.status(400).send({ result: 'Error fetching the user' });

    for (const property in req.body) {
      if (property === 'orderDate') {
        existBooking.orderDate = new Date(req.body.orderDate).toISOString().substring(0, 10);
        continue;
      }
      if (property === 'checkIn') {
        existBooking.checkIn = new Date(req.body.checkIn).toISOString().substring(0, 10);
        continue;
      }
      if (property === 'checkOut') {
        existBooking.checkOut = new Date(req.body.checkOut).toISOString().substring(0, 10);
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
    if (!existBooking) return res.status(400).send({ result: 'Error deleting the booking' });

    await existBooking.delete();

    res.status(202).json({ result: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
