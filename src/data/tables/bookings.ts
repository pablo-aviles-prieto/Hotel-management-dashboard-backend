import { db } from '../database';

const createBookingsTable = async () => {
  const query = `
    CREATE TABLE bookings (
    bookingId INT NOT NULL AUTO_INCREMENT,
    bookingNumber INT NOT NULL,
    orderDate DATE NOT NULL,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    specialRequest LONGTEXT NULL,
    roomType VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    roomId INT NOT NULL,
    PRIMARY KEY (bookingId),
    FOREIGN KEY (roomId)
    REFERENCES rooms(roomId))
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
