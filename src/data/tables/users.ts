import { db } from '../database';

const createUsersTable = async () => {
  const query = `
  CREATE TABLE users (
    userId INT NOT NULL AUTO_INCREMENT,
    photo VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    startDate DATE NOT NULL,
    jobPosition LONGTEXT NOT NULL,
    jobDescription LONGTEXT NULL,
    jobSchedule LONGTEXT NULL,
    contact VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId))
  ENGINE = InnoDB
  `;
  const [result] = await db.query(query);
  console.log('result', result);

  db.end()
    .then(() => console.log('Connection to DB finished'))
    .catch(() => console.error('Error closing the DB.'));

  return result;
};

void createUsersTable();
