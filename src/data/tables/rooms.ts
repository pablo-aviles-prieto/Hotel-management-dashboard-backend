import { db } from '../database';

const createRoomsTable = async () => {
  const query = `
  CREATE TABLE rooms (
    id INT NOT NULL AUTO_INCREMENT,
    photo VARCHAR(255) NOT NULL,
    roomNumber INT NOT NULL,
    roomName VARCHAR(255) NOT NULL,
    bedType VARCHAR(255) NOT NULL,
    roomFloor VARCHAR(255) NOT NULL,
    roomDescription LONGTEXT NOT NULL,
    facilities JSON NOT NULL,
    ratePerNight INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    offerPrice INT NULL,
    PRIMARY KEY (id))
  ENGINE = InnoDB
  `;
  const [result] = await db.query(query);
  console.log('result', result);

  db.end()
    .then(() => console.log('Connection to DB finished'))
    .catch(() => console.error('Error closing the DB.'));

  return result;
};

void createRoomsTable();
