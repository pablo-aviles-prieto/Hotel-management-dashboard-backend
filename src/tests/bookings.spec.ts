import supertest from 'supertest';
import { httpServer } from '../app';
import { jwtTokenGenerator } from '../utils';

describe('Bookings endpoints', () => {
  it('should return the bookings list when test@test.com provided', async () => {
    const jwtToken = jwtTokenGenerator({ id: 0, email: 'test@test.com' });
    const res = await supertest(httpServer).get('/bookings/').set('Authorization', `Bearer ${jwtToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBe('Booking List');
  });
});

httpServer.close();
