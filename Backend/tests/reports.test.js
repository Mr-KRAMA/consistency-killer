const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'rep@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Reports Routes', () => {
  it('GET /api/reports/weekly returns report card', async () => {
    const res = await request(app).get('/api/reports/weekly').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('grade');
    expect(res.body).toHaveProperty('completionRate');
    expect(res.body).toHaveProperty('failures');
    expect(res.body).toHaveProperty('improvements');
    expect(Array.isArray(res.body.failures)).toBe(true);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/reports/weekly');
    expect(res.status).toBe(401);
  });
});
