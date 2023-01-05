import mongoose from 'mongoose';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { RoomModel, BookingModel } from '../models';

let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';
let correctDataToInsert = {};
let dataToEdit = {};
let bookingId = '';
let roomId = '';

beforeAll(async () => {
  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });

  const bookingsList = await BookingModel.find().select({ id: 1 });
  const roomsList = await RoomModel.find().select({ id: 1 });
  bookingId = bookingsList[0].id;
  roomId = roomsList[roomsList.length - 1].id;

  const randomDates = faker.date.betweens('2022-01-01', '2022-12-12', 3);
  const fakeStatus = ['check in', 'check out', 'in progress'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });

  correctDataToInsert = {
    bookingNumber: faker.datatype.number({ min: 1, max: 99999 }),
    userName: faker.name.fullName(),
    orderDate: randomDates[0].toISOString().substring(0, 10),
    checkIn: randomDates[1].toISOString().substring(0, 10),
    checkOut: randomDates[2].toISOString().substring(0, 10),
    status: fakeStatus[randomNumberForStatus],
    roomId
  };
  dataToEdit = {
    bookingNumber: faker.datatype.number({ min: 1, max: 99999 }),
    userName: faker.name.fullName(),
    status: fakeStatus[randomNumberForStatus]
  };
});

describe('Bookings endpoints', () => {
  it(`/bookings (GET) returns 200 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings (GET) return 401 Unauthorized when no JWT provided`, async () => {
    const res = await request(httpServer).get('/bookings/').expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
  it(`/bookings (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings (POST) returns 201 when correct data and JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(correctDataToInsert)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings (POST) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings/1stBooking (GET) returns 200 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings/1stBooking (GET) returns 400 when wrong ID supplied`, async () => {
    const res = await request(httpServer)
      .get(`/bookings/${roomId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(400)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
  });
  it(`/bookings/1stBooking (GET) return 401 Unauthorized when wrong JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings/1stBooking (PATCH) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(dataToEdit)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings/1stbooking (PATCH) return 401 Unauthorized when wrong JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings/1stbooking (DELETE) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings/1stbooking (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/bookings/${bookingId}`)
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
