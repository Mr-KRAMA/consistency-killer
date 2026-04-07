const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect, clear } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'ana@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Analytics Routes', () => {
  it('GET /api/analytics/weekly returns 7 days', async () => {
    const res = await request(app).get('/api/analytics/weekly').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.weekly).toHaveLength(7);
  });

  it('GET /api/analytics/monthly returns 4 weeks', async () => {
    const res = await request(app).get('/api/analytics/monthly').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.monthly).toHaveLength(4);
  });

  it('GET /api/analytics/category returns category breakdown', async () => {
    const res = await request(app).get('/api/analytics/category').set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('GET /api/analytics/dashboard returns today summary', async () => {
    const res = await request(app).get('/api/analytics/dashboard').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('todayScore');
    expect(res.body).toHaveProperty('tasksCompleted');
    expect(res.body).toHaveProperty('caloriesBurned');
    expect(res.body).toHaveProperty('caloriesConsumed');
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/analytics/dashboard');
    expect(res.status).toBe(401);
  });
});
