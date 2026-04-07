const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect, clear } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'diet@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterEach(async () => {
  const Meal = require('../src/models/Meal');
  await Meal.deleteMany({});
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Diet Routes', () => {
  describe('GET /api/diet', () => {
    it('returns empty array initially', async () => {
      const res = await request(app).get('/api/diet').set(auth());
      expect(res.status).toBe(200);
      expect(res.body.meals).toEqual([]);
    });
  });

  describe('POST /api/diet', () => {
    it('creates a meal', async () => {
      const res = await request(app)
        .post('/api/diet')
        .set(auth())
        .send({ name: 'Oatmeal', type: 'Breakfast', calories: 350, protein: 12, carbs: 60, fats: 8 });
      expect(res.status).toBe(201);
      expect(res.body.meal.name).toBe('Oatmeal');
    });

    it('returns 400 if required fields missing', async () => {
      const res = await request(app).post('/api/diet').set(auth()).send({ name: 'Oatmeal' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/diet/:id', () => {
    it('toggles meal logged status', async () => {
      const create = await request(app).post('/api/diet').set(auth()).send({ name: 'Salad', type: 'Lunch', calories: 400, protein: 30, carbs: 20, fats: 15 });
      const id = create.body.meal._id;
      const res = await request(app).put(`/api/diet/${id}`).set(auth()).send({ logged: false });
      expect(res.status).toBe(200);
      expect(res.body.meal.logged).toBe(false);
    });
  });

  describe('DELETE /api/diet/:id', () => {
    it('deletes a meal', async () => {
      const create = await request(app).post('/api/diet').set(auth()).send({ name: 'Shake', type: 'Snack', calories: 200, protein: 25, carbs: 15, fats: 5 });
      const id = create.body.meal._id;
      const res = await request(app).delete(`/api/diet/${id}`).set(auth());
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/diet/weekly', () => {
    it('returns 7 days of data', async () => {
      const res = await request(app).get('/api/diet/weekly').set(auth());
      expect(res.status).toBe(200);
      expect(res.body.weekly).toHaveLength(7);
    });
  });
});
