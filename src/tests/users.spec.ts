import mongoose from 'mongoose';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { UserModel } from '../models';

let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';
let correctDataToInsert = {};
let dataToEdit = {};
let userId = '';

beforeAll(async () => {
  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });

  const usersList = await UserModel.find().select({ id: 1 });
  userId = usersList[0].id;

  correctDataToInsert = {
    photo: 'photo test',
    name: 'test name',
    email: faker.internet.email(),
    password: 'testPassword',
    startDate: '2023-05-01',
    job: {
      position: 'test position job',
      description: 'test description job',
      schedule: 'test schedule job'
    },
    contact: 'test contact',
    status: 'test status'
  };
  dataToEdit = {
    email: 'edited@email.test',
    password: 'editedPassword',
    job: {
      position: 'edited position job',
      description: 'edited description job'
    }
  };
});

describe('Users endpoints', () => {
  it(`/users (GET) returns 200 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
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

  it(`/users/ (POST) returns 201 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/users/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(correctDataToInsert)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
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

  it(`/users/1stUser (GET) returns 200 and the 1st obj from IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/users/1stUser (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/1stUser (PATCH) returns 202 and IUsers[] updated when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(dataToEdit)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/users/1stUser (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/users/1stUser (DELETE) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/users/1stUser (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/users/${userId}`)
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
