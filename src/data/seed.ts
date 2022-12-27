import { db } from './database';

const insertData = async () => {
  const query = `
    INSERT INTO bookings (bookingNumber, orderDate, checkIn, checkOut, specialRequest, roomType, status)
    VALUES ('51', '2022-12-13', '2022-12-24', '2022-12-27', 'No special request', 'C-Floor 02', 'check out')
  `;
  const [result] = await db.query(query);
  console.log('result', result);

  db.end()
    .then(() => console.log('Connection to DB finished'))
    .catch(() => console.error('Error closing the DB.'));

  return result;
};

void insertData();
