const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'set@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Settings Routes', () => {
  it('GET /api/settings returns default settings', async () => {
    const res = await request(app).get('/api/settings').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.settings.fitnessEnabled).toBe(true);
    expect(res.body.settings.dietEnabled).toBe(true);
    expect(res.body.settings.notifications).toBe(true);
  });

  it('PUT /api/settings updates settings', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set(auth())
      .send({ fitnessEnabled: false, calorieTarget: 1800 });
    expect(res.status).toBe(200);
    expect(res.body.settings.fitnessEnabled).toBe(false);
    expect(res.body.settings.calorieTarget).toBe(1800);
  });

  it('PUT /api/settings ignores unknown fields', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set(auth())
      .send({ unknownField: 'hacked', notifications: false });
    expect(res.status).toBe(200);
    expect(res.body.settings.notifications).toBe(false);
    expect(res.body.settings.unknownField).toBeUndefined();
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(401);
  });
});
