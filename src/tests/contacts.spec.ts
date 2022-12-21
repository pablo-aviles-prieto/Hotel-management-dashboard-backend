import * as fs from 'fs';
import { resolve } from 'path';
import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';
import { IContacts } from '../interfaces';

let contactsList: IContacts[] = [];
let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';

beforeAll(() => {
  const pathToJSONData = resolve(__dirname, '../assets/data/contacts.json');
  const rawData = fs.readFileSync(pathToJSONData).toString();
  contactsList = JSON.parse(rawData);

  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });
});

describe('Contacts endpoints', () => {
  it(`/contacts (GET) returns 200 and IContacts[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IContacts[]>(contactsList);
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
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/contacts (POST) returns 200 and IContacts[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IContacts[]>(contactsList);
  });
  it(`/contacts (POST) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/contacts/')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/contacts/1 (GET) returns 200 and the 1st obj from IContacts[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/contacts/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IContacts>(contactsList[0]);
  });
  it(`/contacts/1 (GET) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/contacts/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/contacts/1 (PATCH) returns 200 and the modified IContacts obj when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/contacts/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IContacts>(contactsList[0]);
  });
  it(`/contacts/1 (PATCH) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/contacts/1')
      .set('Authorization', `Bearer ${jwtTokenIncorrect}`)
      .expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });

  it(`/contacts/1 (DELETE) returns 200 and IContacts[] updated when correct JWT provided`, async () => {
    const filteredArray = contactsList.filter((contact) => contact.id !== 1);

    const res = await request(httpServer)
      .delete('/contacts/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
    expect(res.body).toStrictEqual<IContacts[]>(filteredArray);
  });
  it(`/contacts/1 (DELETE) return 401 Unauthorized when incorrect JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/contacts/1')
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
