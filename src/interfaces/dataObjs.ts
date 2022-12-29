import { RowDataPacket } from 'mysql2';

export interface IContacts {
  id: number;
  date: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  messageSubject?: string;
  messageBody?: string;
  archived: number;
}

export interface IContactsRow extends IContacts, RowDataPacket {}

export interface IUsers {
  id?: number;
  photo: string;
  name: string;
  email: string;
  password?: string;
  startDate: string;
  jobPosition?: string;
  jobDescription?: string;
  jobSchedule?: string;
  contact: string;
  status: string;
}

export interface IUsersRow extends IUsers, RowDataPacket {}

export interface IRooms {
  id: number;
  photo: string;
  roomNumber: string;
  roomName: string;
  bedType: string;
  roomFloor: string;
  facilities: string[];
  ratePerNight: number;
  status: string;
  offerPrice: string | null;
}

export interface IBookings {
  id: number;
  bookingNumber: number;
  user: { name: string; picture: string };
  orderDate: string;
  checkIn: string;
  checkOut: string;
  specialRequest: string | null;
  roomType: string;
  status: string;
}
