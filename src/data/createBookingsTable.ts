import { db } from './database';

const createBookingsTable = async () => {
  const query = `
  CREATE TABLE hotel_miranda.bookings (
    bookingId INT NOT NULL AUTO_INCREMENT,
    bookingNumber INT NOT NULL,
    orderDate DATE NOT NULL,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    specialRequest VARCHAR(255) NULL,
    roomType VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (bookingId))
  ENGINE = InnoDB
  `;
  const [result] = await db.query(query);
  console.log('result', result);

  db.end()
    .then(() => console.log('Connection to DB finished'))
    .catch(() => console.error('Error closing the DB.'));

  return result;
};

void createBookingsTable();
