import mongoose from 'mongoose';
import request from 'supertest';
import { httpServer } from '../app';

describe('Auth endpoints', () => {
  it(`/login (POST) return 200 and the JWT when the main user 'hotel@miranda.com/test123' is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ email: 'hotel@miranda.com', password: 'test123' })
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`/login (POST) return 401 and error message when no mail is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ password: 'test' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
  });
  it(`/login (POST) return 401 and error message when incorrect mail is provided`, async () => {
    const res = await request(httpServer)
      .post('/login')
      .send({ email: 'test2@test.com', password: 'test123' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Check the credentials and try again!');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  httpServer.close();
});
