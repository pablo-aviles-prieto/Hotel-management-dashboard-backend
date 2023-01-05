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

  const fakePhotos = [
    'https://www.interstatedevelopment.com/wp-content/uploads/2019/04/generic-avatar-1.jpg',
    'https://www.pngkey.com/png/detail/308-3081138_contact-avatar-generic.png'
  ];
  const randomNumberForPhotos = faker.datatype.number({
    min: 0,
    max: fakePhotos.length - 1
  });
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
  const fakeStatus = ['Active', 'Inactive'];
  const randomNumberForStatus = faker.datatype.number({
    min: 0,
    max: fakeStatus.length - 1
  });

  correctDataToInsert = {
    photo: fakePhotos[randomNumberForPhotos],
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    startDate: new Date().toISOString().substring(0, 10),
    job: {
      position: fakeJobPosition[randomNumberForJobPosition],
      description: fakeJobDescription[randomNumberForJobDescription],
      schedule: 'test schedule job'
    },
    contact: faker.phone.number('9##-###-###'),
    status: fakeStatus[randomNumberForStatus]
  };
  dataToEdit = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    job: {
      position: fakeJobPosition[randomNumberForJobPosition],
      description: fakeJobDescription[randomNumberForJobDescription]
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
