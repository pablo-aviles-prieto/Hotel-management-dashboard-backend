import mongoose from 'mongoose';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { RoomModel } from '../models';

let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';
let correctDataToInsert = {};
let dataToEdit = {};
let roomId = '';

beforeAll(async () => {
  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });

  const roomsList = await RoomModel.find().select({ id: 1 });
  roomId = roomsList[0].id;

  const fakePhotos = [
    'https://pablo-aviles-prieto.github.io/hotel-management-app/assets/hotel-rooms/room1.jpg',
    'https://pablo-aviles-prieto.github.io/hotel-management-app/assets/hotel-rooms/room2.jpg',
    'https://pablo-aviles-prieto.github.io/hotel-management-app/assets/hotel-rooms/room3.jpg'
  ];
  const randomNumberForPhotos = faker.datatype.number({
    min: 0,
    max: fakePhotos.length - 1
  });
  const fakeBedType = ['Double superior', 'Single bed', 'Double bed'];
  const randomNumberForBedType = faker.datatype.number({
    min: 0,
    max: fakeBedType.length - 1
  });
  const fakeRoomFloor = ['A-1', 'B-3', 'B-2', 'B-1', 'A-2', 'A-3'];
  const randomNumberForRoomFloor = faker.datatype.number({
    min: 0,
    max: fakeRoomFloor.length - 1
  });
  const fakeFacilities = [
    ['Shower', 'LED TV', 'Coffee Set', 'Towel'],
    ['Shower', 'Double Bed', 'Wifi', 'Coffee Set'],
    ['LED TV', 'Bath', 'AC', 'Wifi'],
    ['AC', 'LED TV', 'Towel', 'Bath'],
    ['AC', 'Shower', 'Towel', 'Wifi'],
    ['Double Bed', 'LED TV', 'Towel', 'Coffee Set']
  ];
  const randomNumberForFacilities = faker.datatype.number({
    min: 0,
    max: fakeFacilities.length - 1
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
  const fakeStatus = ['Booked', 'Available'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });

  correctDataToInsert = {
    images: fakePhotos[randomNumberForPhotos],
    roomNumber: faker.datatype.number({
      min: 0,
      max: 9999
    }),
    roomName: faker.animal.fish(),
    bedType: fakeBedType[randomNumberForBedType],
    roomFloor: fakeRoomFloor[randomNumberForRoomFloor],
    roomDescription: 'test description',
    roomType: fakeRoomType[randomNumberForRoomType],
    facilites: fakeFacilities[randomNumberForFacilities],
    ratePerNight: faker.datatype.number({
      min: 199,
      max: 599
    }),
    status: fakeStatus[randomNumberForStatus]
  };
  dataToEdit = {
    roomFloor: fakeRoomFloor[randomNumberForRoomFloor],
    roomDescription: 'edited description',
    roomType: fakeRoomType[randomNumberForRoomType]
  };
});

describe('Rooms endpoints', () => {
  it(`/rooms (GET) returns 200 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/rooms (GET) return 401 Unauthorized when no JWT provided`, async () => {
    const res = await request(httpServer).get('/rooms/').expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
  it(`/rooms (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms (POST) returns 201 and IRooms[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(correctDataToInsert)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/rooms (POST) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms/1stRoom (GET) returns 200 and the 1st obj from IRooms[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/rooms/1stRoom (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms/1stRoom (PATCH) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(dataToEdit)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/rooms/1stRoom (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms/1stRoom (DELETE) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/rooms/1stRoom (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  httpServer.close();
});
