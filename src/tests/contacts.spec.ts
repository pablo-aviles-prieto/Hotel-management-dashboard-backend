import mongoose from 'mongoose';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { httpServer } from '../app';
import { incorrectJWTTokenGenerator, jwtTokenGenerator } from '../utils';
import { ContactModel } from '../models';

let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';
let correctDataToInsert = {};
let dataToEdit = {};
let contactId = '';

beforeAll(async () => {
  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = incorrectJWTTokenGenerator({ id: 0, email: 'test1@test.com' });

  const contactsList = await ContactModel.find().select({ id: 1 });
  contactId = contactsList[contactsList.length - 1].id;

  const fakeMessageSubject = ['Best memories', 'Unhappy stay', 'Best place', 'A bit weird', 'Amazing views'];
  const randomNumberForMessageSubject = faker.datatype.number({
    min: 0,
    max: fakeMessageSubject.length - 1
  });
  const fakeMessageBody = [
    'It was a good place to crash out',
    'Im surprised with all the surroundings',
    'I could say a few things to improve, but overall was a good place to chill out',
    `Couldnt say anything bad about it`,
    'Happiest place ever',
    'I would disagree with some previous recommendations',
    'Simple the best hotel ever',
    'The best place Ive ever seen'
  ];
  const randomNumberForMessageBody = faker.datatype.number({
    min: 0,
    max: fakeMessageBody.length - 1
  });

  correctDataToInsert = {
    date: faker.date.between('2022-01-01', '2022-12-12').toISOString().substring(0, 10),
    user: {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('9##-###-###')
    },
    message: {
      subject: fakeMessageSubject[randomNumberForMessageSubject],
      body: fakeMessageBody[randomNumberForMessageBody]
    },
    archived: faker.datatype.boolean()
  };
  dataToEdit = {
    user: {
      name: faker.name.fullName(),
      email: faker.internet.email()
    },
    archived: faker.datatype.boolean()
  };
});

describe('Contacts endpoints', () => {
  it(`/contacts (GET) returns 200 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/contacts (GET) return 401 Unauthorized when no JWT provided`, async () => {
    const res = await request(httpServer).get('/contacts/').expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
  it(`/contacts (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });

  it(`/contacts (POST) returns 201 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(correctDataToInsert)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/contacts (POST) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });

  it(`/contacts/1stContact (GET) returns 200 and the 1st obj from IContacts[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/contacts/1stContact (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });

  it(`/contacts/1 (PATCH) returns 202 updated when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .send(dataToEdit)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/contacts/1stContact (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });

  it(`/contacts/1stContact (DELETE) returns 202 when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/contacts/1stContact (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  httpServer.close();
});
