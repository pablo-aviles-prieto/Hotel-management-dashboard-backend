import * as fs from 'fs';
import { resolve } from 'path';
import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { IUsers } from '../interfaces';

const pathToJSONData = resolve(__dirname, '../assets/data/users.json');
const rawData = fs.readFileSync(pathToJSONData).toString();
const usersList: IUsers[] = JSON.parse(rawData);

const jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
const jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });

describe('Bookings endpoints', () => {
  it(`/users (GET) returns 200 and IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IUsers[]>(usersList);
  });
  it(`/users (GET) return 401 Unauthorized when no JWT provided`, async () => {
    const res = await request(httpServer).get('/users/').expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
  it(`/users (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/ (POST) returns 200 and IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/users/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IUsers[]>(usersList);
  });
  it(`/users/ (POST) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/users/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/1 (GET) returns 200 and the 1st obj from IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IUsers>(usersList[0]);
  });
  it(`/users/1 (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/1 (PATCH) returns 200 and the 1st obj from IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IUsers>(usersList[0]);
  });
  it(`/users/1 (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/users/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/1 (DELETE) returns 200 and IUsers[] updated when correct JWT provided`, async () => {
    const filteredArray = usersList.filter((user) => user.id !== 1);

    const res = await request(httpServer)
      .delete('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IUsers[]>(filteredArray);
  });
  it(`/users/1 (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/users/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });
});
httpServer.close();
