export interface IContacts {
  id: number;
  date: string;
  user: { name: string; email: string; phone: string };
  message: { subject: string; body: string };
  rate: number;
  archived?: boolean;
}

export interface IUsers {
  id: number;
  photo: string;
  name: string;
  email: string;
  startDate: string;
  job: { position: string; description: string; schedule: string };
  contact: string;
  status: string;
}

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
