import * as fs from 'fs';
import { resolve } from 'path';
import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { IBookings } from '../interfaces';

let bookingsList: IBookings[] = [];
let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';

beforeAll(() => {
  const pathToJSONData = resolve(__dirname, '../assets/data/bookings.json');
  const rawData = fs.readFileSync(pathToJSONData).toString();
  bookingsList = JSON.parse(rawData);

  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });
});

describe('Bookings endpoints', () => {
  it(`/bookings (GET) returns 200 and IBookings[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IBookings[]>(bookingsList);
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

  it(`/bookings (POST) returns 201 and IBookings[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/bookings/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IBookings[]>(bookingsList);
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

  it(`/bookings/1 (GET) returns 200 and the 1st obj from IBookings[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IBookings>(bookingsList[0]);
  });
  it(`/bookings/1 (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings/1 (PATCH) returns 202 and IBookings[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IBookings[]>(bookingsList);
  });
  it(`/bookings/1 (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/bookings/1 (DELETE) returns 204 and void when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(204);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/bookings/1 (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/bookings/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });
});

afterAll(() => {
  httpServer.close();
});
