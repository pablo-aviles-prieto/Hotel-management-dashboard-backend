import * as fs from 'fs';
import { db } from '../data/database';
import { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';
import { IBookings, IBookingsRow } from '../interfaces';
import { RowDataPacket, OkPacket } from 'mysql2';

const pathToJSONData = resolve(__dirname, '../assets/data/bookings.json');

export const getBookingsList = async (req: Request, res: Response, next: NextFunction) => {
  const query = `
    SELECT bookings.*, rooms.roomType, rooms.photo FROM bookings
    INNER JOIN rooms ON rooms.id = bookings.roomId
  `;
  try {
    const [rawBookingsList] = await db.query<IBookingsRow[]>(query);
    const bookingsList = rawBookingsList.map((booking) => {
      const updatedObj = {
        ...booking,
        roomImg: booking.photo,
        orderDate: new Date(booking.orderDate).toISOString().substring(0, 10),
        checkIn: new Date(booking.checkIn).toISOString().substring(0, 10),
        checkOut: new Date(booking.checkOut).toISOString().substring(0, 10)
      };
      delete updatedObj.photo;
      return updatedObj;
    });
    res.status(200).json({ result: bookingsList });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  const queryPost = `INSERT INTO bookings SET ?`;
  // const { bookingNumber, userName, checkIn, checkOut, specialRequest, status, roomId } = req.body;
  const bookingsToInsertOnDB = {
    ...req.body,
    orderDate: new Date().toISOString().substring(0, 10)
  };

  try {
    const [resultCreatingBooking] = await db.query<OkPacket>(queryPost, bookingsToInsertOnDB);
    const insertedObj = {
      ...bookingsToInsertOnDB,
      id: resultCreatingBooking.insertId
    };
    delete insertedObj.password;
    res.status(201).json({ result: insertedObj });
  } catch (error) {
    next(error);
  }
};

export const getSingleBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  const query = `
    SELECT bookings.*, rooms.roomType, rooms.photo, rooms.roomName FROM bookings
    INNER JOIN rooms ON rooms.id = bookings.roomId
    WHERE bookings.id = ?
  `;
  try {
    const [getBooking] = await db.query<IBookingsRow[]>(query, parseInt(bookingId));
    if (getBooking.length === 0)
      return res.status(400).json({ result: 'Error fetching the booking' });

    const parsedBooking = {
      ...getBooking[0],
      roomImg: getBooking[0].photo
    };
    delete parsedBooking.photo;

    res.status(200).json({ result: parsedBooking });
  } catch (error) {
    next(error);
  }
};

export const editBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  const queryGetBooking = `SELECT * FROM bookings WHERE id = ?`;
  const queryEdit = `UPDATE bookings SET ? WHERE id = ?`;
  const { bookingNumber, userName, checkIn, checkOut, specialRequest, status, roomId } = req.body;

  try {
    const [getBooking] = await db.query<RowDataPacket[]>(queryGetBooking, parseInt(bookingId));
    if (getBooking.length === 0)
      return res.status(400).json({ result: 'Error editing the booking' });

    const bookingToUpdateOnDB = {
      bookingNumber: bookingNumber ? bookingNumber : getBooking[0].bookingNumber,
      userName: userName ? userName : getBooking[0].userName,
      checkIn: checkIn ? checkIn : getBooking[0].checkIn,
      checkOut: checkOut ? checkOut : getBooking[0].checkOut,
      specialRequest: specialRequest ? specialRequest : getBooking[0].specialRequest,
      status: status ? status : getBooking[0].status,
      roomId: roomId ? roomId : getBooking[0].roomId
    };

    await db.query<OkPacket>(queryEdit, [bookingToUpdateOnDB, parseInt(bookingId)]);
    res.status(202).json({ result: 'Booking updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  const query = `DELETE FROM bookings WHERE id = ?`;
  try {
    const [result] = await db.query<OkPacket>(query, parseInt(bookingId));
    if (result.affectedRows === 0) {
      return res.status(404).json({ result: 'Error deleting the selected booking' });
    }

    res.status(202).json({ result: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
