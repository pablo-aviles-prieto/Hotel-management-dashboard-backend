import { Document } from 'mongoose';

export interface IContacts {
  id?: string;
  date: string;
  user: { name: string; email: string; phone: string };
  message: { subject: string; body: string };
  rate: number;
  archived?: boolean;
}

export interface IUsers extends Document {
  id?: string;
  photo: string;
  name: string;
  email: string;
  password: string;
  startDate?: string;
  job: { position?: string; description?: string; schedule?: string };
  contact: string;
  status: string;
  [key: string]: any;
}

export interface IRooms extends Document {
  id?: string;
  photo: string;
  roomNumber: number;
  roomName: string;
  bedType: string;
  roomFloor: string;
  facilities: string[];
  ratePerNight: number;
  status: string;
  offerPrice: number | null;
  [key: string]: any;
}

export interface IBookings {
  id?: string;
  bookingNumber: number;
  user: { name: string; picture: string };
  orderDate: string;
  checkIn: string;
  checkOut: string;
  specialRequest: string | null;
  roomType: string;
  status: string;
}
