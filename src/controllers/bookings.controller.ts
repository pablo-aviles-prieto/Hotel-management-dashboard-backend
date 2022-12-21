import * as fs from 'fs';
import { resolve } from 'path';
import { Request, Response, NextFunction } from 'express';
import { IBookings } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/bookings.json');

export const getBookingsList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  console.log('req.user', req.user);
  res.status(200).json(bookingsList);
};

export const createBooking = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  res.status(200).json(bookingsList);
};

export const getSingleBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  const getBooking = bookingsList.find((booking) => booking.id === +bookingId);
  res.status(200).json(getBooking);
};

export const editBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  const getBooking = bookingsList.find((booking) => booking.id === +bookingId);
  res.status(200).json(getBooking);
};

export const deleteBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  const newBookingsList = bookingsList.filter((booking) => booking.id !== +bookingId);
  res.status(200).json(newBookingsList);
};
