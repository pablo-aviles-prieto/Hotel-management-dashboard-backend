import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';
import { IBookings } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/bookings.json');

export const getBookingsList = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  // console.log('req.user', req.user);
  res.status(200).json(bookingsList);
};

export const createBooking = (req: Request, res: Response, _next: NextFunction) => {
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  //TODO Check inputs before saving on DB
  //TODO Return the created Obj
  res.status(201).json(bookingsList);
};

export const getSingleBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  const getBooking = bookingsList.find((booking) => booking.id === +bookingId);
  if (!getBooking) {
    res.status(422).end();
    return;
  }
  res.status(200).json(getBooking);
};

export const editBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);
  const getBooking = bookingsList.find((booking) => booking.id === +bookingId);

  if (!getBooking) {
    res.status(422).end();
    return;
  }

  //TODO Check inputs before saving on DB

  const newBookingsArr = [...bookingsList];
  const indexOfObj = newBookingsArr.findIndex((obj) => obj.id === +bookingId);
  newBookingsArr[indexOfObj] = {
    ...newBookingsArr[indexOfObj],
    ...req.body
  };

  res.status(202).json(newBookingsArr);
};

export const deleteBooking = (req: Request, res: Response, _next: NextFunction) => {
  const { bookingId } = req.params;
  const rawData = fs.readFileSync(pathToJSONData).toString();
  const bookingsList: IBookings[] = JSON.parse(rawData);

  const bookingSelected = bookingsList.find((booking) => booking.id === +bookingId);

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('');
  //   }, 2000);
  // });

  if (!bookingSelected) {
    res.status(422).end();
    return;
  }

  res.status(204).end();
};
