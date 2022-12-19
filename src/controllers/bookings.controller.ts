import { Request, Response, NextFunction } from 'express';

export const getBookingsList = async (req: Request, res: Response, next: NextFunction) => {
  console.log('req.user', req.user);
  res.status(200).json('Booking List');
};
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('Create Booking');
};
export const getSingleBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  res.status(200).json(`Single Booking ${bookingId}`);
};
export const editBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  res.status(200).json(`Edit Booking ${bookingId}`);
};
