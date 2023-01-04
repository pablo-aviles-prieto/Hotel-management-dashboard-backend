import mongoose from 'mongoose';
import request from 'supertest';
import { httpServer } from '../app';

describe('Auth endpoints', () => {
  it(`/login (POST) return 200 and the JWT when hardcoded 'test@test.com' is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ email: 'test@test.com', password: 'test' })
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/login (POST) return 401 'Not my hardcoded user' when no mail is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ password: 'test' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /text/);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Not my hardcoded user');
  });
  it(`/login (POST) return 401 'Not my hardcoded user' when incorrect mail is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ email: 'test2@test.com', password: 'test' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /text/);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Not my hardcoded user');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  httpServer.close();
});
