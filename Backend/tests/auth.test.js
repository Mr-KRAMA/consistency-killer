const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect, clear } = require('./setup');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
});
afterEach(async () => await clear());
afterAll(async () => await disconnect());

describe('Auth Routes', () => {
  const user = { name: 'Test User', email: 'test@example.com', password: 'password123' };

  describe('POST /api/auth/register', () => {
    it('registers a new user and returns token', async () => {
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.password).toBeUndefined();
    });

    it('returns 409 if email already exists', async () => {
      await request(app).post('/api/auth/register').send(user);
      const res = await request(app).post('/api/auth/register').send(user);
      expect(res.status).toBe(409);
    });

    it('returns 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(user);
    });

    it('logs in with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('returns 401 with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns current user with valid token', async () => {
      const reg = await request(app).post('/api/auth/register').send(user);
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${reg.body.token}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(user.email);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/auth/me', () => {
    it('updates user name', async () => {
      const reg = await request(app).post('/api/auth/register').send(user);
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${reg.body.token}`)
        .send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Updated Name');
    });
  });
});
