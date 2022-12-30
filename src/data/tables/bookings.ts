import { db } from '../database';

const createBookingsTable = async () => {
  const query = `
    CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT,
    bookingNumber INT NOT NULL,
    userName VARCHAR(255) NOT NULL,
    orderDate DATE NOT NULL,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    specialRequest LONGTEXT NULL,
    status VARCHAR(255) NOT NULL,
    roomId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (roomId)
    REFERENCES rooms(id))
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