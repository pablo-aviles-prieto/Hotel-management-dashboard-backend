import * as fs from 'fs';
import { resolve } from 'path';
import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { IRooms } from '../interfaces';

let roomsList: IRooms[] = [];
let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';

beforeAll(() => {
  const pathToJSONData = resolve(__dirname, '../assets/data/rooms.json');
  const rawData = fs.readFileSync(pathToJSONData).toString();
  roomsList = JSON.parse(rawData);

  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });
});

describe('Rooms endpoints', () => {
  it(`/rooms (GET) returns 200 and IRooms[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IRooms[]>(roomsList);
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

  it(`/rooms (POST) returns 200 and IRooms[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/rooms/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IRooms[]>(roomsList);
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

  it(`/rooms/1 (GET) returns 200 and the 1st obj from IRooms[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/rooms/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IRooms>(roomsList[0]);
  });
  it(`/rooms/1 (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/rooms/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms/1 (PATCH) returns 200 and the modified IRooms obj when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/rooms/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IRooms>(roomsList[0]);
  });
  it(`/rooms/1 (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/rooms/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/rooms/1 (DELETE) returns 200 and IRooms[] updated when correct JWT provided`, async () => {
    const filteredArray = roomsList.filter((room) => room.id !== 1);

    const res = await request(httpServer)
      .delete('/rooms/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IRooms[]>(filteredArray);
  });
  it(`/rooms/1 (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/rooms/1')
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