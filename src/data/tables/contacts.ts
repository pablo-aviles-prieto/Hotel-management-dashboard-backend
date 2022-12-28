import { db } from '../database';

const createContactsTable = async () => {
  const query = `
    CREATE TABLE contacts (
    contactId INT NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL,
    messageSubject VARCHAR(255) NOT NULL,
    messageBody LONGTEXT NOT NULL,
    archived TINYINT NOT NULL,
    PRIMARY KEY (contactId))
    ENGINE = InnoDB
  `;
  const [result] = await db.query(query);
  console.log('result', result);

  db.end()
    .then(() => console.log('Connection to DB finished'))
    .catch(() => console.error('Error closing the DB.'));

  return result;
};

void createContactsTable();
