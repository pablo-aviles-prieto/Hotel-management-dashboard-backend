import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
import { hash } from 'bcryptjs';
import { db } from '../database';

config();

const { BCRYPT_SALT } = process.env;

const insertUserData = async () => {
  const fakePhotos = [
    'https://www.interstatedevelopment.com/wp-content/uploads/2019/04/generic-avatar-1.jpg',
    'https://www.pngkey.com/png/detail/308-3081138_contact-avatar-generic.png'
  ];
  const randomNumberForPhotos = faker.datatype.number({
    min: 0,
    max: fakePhotos.length - 1
  });
  const randomName = faker.name.fullName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();
  const salt = BCRYPT_SALT ? +BCRYPT_SALT : 12;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const hashedPassword = await hash(randomPassword, salt);
  const randomStartDate = faker.date
    .between('2022-01-01', '2022-12-31')
    .toISOString()
    .substring(0, 10);
  const fakeJobPosition = ['Room service', 'Receptionist', 'Chef', 'Manager'];
  const randomNumberForJobPosition = faker.datatype.number({
    min: 0,
    max: fakeJobPosition.length - 1
  });
  const fakeJobDescription = [
    'Anticipate guests needs in order to accommodate them and provide an exceptional guest experience',
    'Answering guest inquiries. Directing phone calls. Coordinating travel plans',
    'Offer restaurant and activity recommendations and assist guests in arranging transportation',
    'Act as a liaison between guests and any department necessary including the kitchen. Housekeeping'
  ];
  const randomNumberForJobDescription = faker.datatype.number({
    min: 0,
    max: fakeJobDescription.length - 1
  });
  const fakeJobSchedule = [
    'Saturday and Sunday',
    'Tuesday and Wednesday',
    'Monday and Friday',
    'Thrusday and Saturday'
  ];
  const randomNumberForJobSchedule = faker.datatype.number({
    min: 0,
    max: fakeJobSchedule.length - 1
  });
  const randomContact = faker.phone.number('9##-###-###');
  const fakeStatus = ['Active', 'Inactive'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });

  const query = `
    INSERT INTO users (photo, name, email, password, startDate, jobPosition, jobDescription, jobSchedule, contact, status)
    VALUES ('${fakePhotos[randomNumberForPhotos]}', '${randomName}', '${randomEmail}', '${hashedPassword}', '${randomStartDate}', '${fakeJobPosition[randomNumberForJobPosition]}', '${fakeJobDescription[randomNumberForJobDescription]}', '${fakeJobSchedule[randomNumberForJobSchedule]}', '${randomContact}', '${fakeStatus[randomNumberForStatus]}')
  `;

  const [result] = await db.query(query);
  console.log('result', result);
  return;
};

const insertData = (numberOfExecutes: number) => {
  [...Array(numberOfExecutes)].forEach(async () => {
    await insertUserData();
  });
};

void insertData(30);
