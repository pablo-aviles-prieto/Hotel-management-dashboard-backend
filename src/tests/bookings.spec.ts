import request from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';

describe('Bookings endpoints', () => {
  it(`should return 200 and json data when JWT with 'test@test.com' provided`, async () => {
    const jwtToken = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
    const res = await request(httpServer)
      .get('/bookings/')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.ok).toBe(true);
    expect(res.error).toBeFalsy();
  });
  it(`should return 401 Unauthorized when no JWT provided`, async () => {
    const res = await request(httpServer).get('/bookings/').expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.text).toMatch('Unauthorized');
  });
  it(`should return 401 Unauthorized when the email in JWT is not test@test.com`, async () => {
    const jwtToken = jwtTokenGenerator({ id: 0, email: 'test1@test.com' });
    const res = await request(httpServer).get('/bookings/').set('Authorization', `Bearer ${jwtToken}`).expect(401);

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.body.error).toMatch('Unauthorized');
  });
});

httpServer.close();
