import { faker } from '@faker-js/faker';
import { db } from '../database';

const insertBookingData = async () => {
  const randomBookingNumber = faker.datatype.number({ min: 1, max: 99999 });
  const randomDates = faker.date.betweens('2022-01-01', '2022-12-12', 3);
  const randomOrderDate = randomDates[0].toISOString().substring(0, 10);
  const randomCheckIn = randomDates[1].toISOString().substring(0, 10);
  const randomCheckOut = randomDates[2].toISOString().substring(0, 10);
  const fakeSpecialRequest = [
    'Random special request',
    'I want a teddy bear on my bed',
    'I need a coffee set on my bedroom',
    'Nothing needed',
    'I would like to have silk bed sheet',
    null
  ];
  const randomNumberForSpecialRequest = faker.datatype.number({
    min: 0,
    max: fakeSpecialRequest.length - 1
  });
  const fakeRoomType = [
    'Deluxe C-661',
    'Deluxe B-55',
    'Deluxe A-26',
    'Medium B-33',
    'Medium A-53',
    'Simple A-11',
    'Simple A-25'
  ];
  const randomNumberForRoomType = faker.datatype.number({
    min: 0,
    max: fakeRoomType.length - 1
  });
  const fakeStatus = ['check in', 'check out', 'in progress'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });
  const randomRoomId = faker.datatype.number({
    min: 1,
    max: 10
  });

  const query = `
    INSERT INTO bookings (bookingNumber, orderDate, checkIn, checkOut, specialRequest, roomType, status, roomId)
    VALUES ('${randomBookingNumber}', '${randomOrderDate}', '${randomCheckIn}', '${randomCheckOut}', '${fakeSpecialRequest[randomNumberForSpecialRequest]}', '${fakeRoomType[randomNumberForRoomType]}', '${fakeStatus[randomNumberForStatus]}', '${randomRoomId}')
  `;

  const [result] = await db.query(query);
  console.log('result', result);
  return;
};

const insertData = (numberOfExecutes: number) => {
  [...Array(numberOfExecutes)].forEach(async () => {
    await insertBookingData();
  });
};

void insertData(10);
