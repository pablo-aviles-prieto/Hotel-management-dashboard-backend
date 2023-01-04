import mongoose from 'mongoose';
import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';

let jwtTokenCorrect: string | null = '';
let jwtTokenIncorrect: string | null = '';

beforeAll(() => {
  jwtTokenCorrect = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
  jwtTokenIncorrect = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });
});

describe('Users endpoints', () => {
  it(`/users (GET) returns 200 and IUsers[] when correct JWT provided`, async () => {
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

  it(`/users/ (POST) returns 201 and IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .post('/users/')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
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

  it(`/users/1 (GET) returns 200 and the 1st obj from IUsers[] when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .get('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
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

  it(`/users/1 (PATCH) returns 202 and IUsers[] updated when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .patch('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(202)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
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

  it(`/users/1 (DELETE) returns 204 and void when correct JWT provided`, async () => {
    const res = await request(httpServer)
      .delete('/users/1')
      .set('Authorization', `Bearer ${jwtTokenCorrect}`)
      .expect(204);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
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

afterAll(async () => {
  await mongoose.disconnect();
  httpServer.close();
});
