import { faker } from '@faker-js/faker';
import { mongodb } from '../../loaders';
import { config } from 'dotenv';
import { BookingModel, RoomModel } from '../../models';
import { IRooms } from '../../interfaces';

config();

void mongodb();

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
  const fakeStatus = ['check in', 'check out', 'in progress'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });
  const allRooms = await RoomModel.find().select({ _id: 1 }).exec();
  const parsedRooms = allRooms.map((room) => room._id);
  const randomRoomId = faker.datatype.number({
    min: 0,
    max: parsedRooms.length - 1
  });
  const randomUserName = faker.name.fullName();

  const booking = new BookingModel({
    bookingNumber: randomBookingNumber,
    userName: randomUserName,
    orderDate: randomOrderDate,
    checkIn: randomCheckIn,
    checkOut: randomCheckOut,
    specialRequest: fakeSpecialRequest[randomNumberForSpecialRequest],
    status: fakeStatus[randomNumberForStatus],
    roomId: parsedRooms[randomRoomId]
  });

  const result = await booking.save();
  console.log('result', result);
  return;
};

const insertData = (numberOfExecutes: number) => {
  [...Array(numberOfExecutes)].forEach(async () => {
    await insertBookingData();
  });
};

void insertData(5);
