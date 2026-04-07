const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect, clear } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'fit@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterEach(async () => {
  const Workout = require('../src/models/Workout');
  await Workout.deleteMany({});
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Fitness Routes', () => {
  describe('GET /api/fitness', () => {
    it('returns empty array initially', async () => {
      const res = await request(app).get('/api/fitness').set(auth());
      expect(res.status).toBe(200);
      expect(res.body.workouts).toEqual([]);
    });
  });

  describe('POST /api/fitness', () => {
    it('creates a workout', async () => {
      const res = await request(app)
        .post('/api/fitness')
        .set(auth())
        .send({ exercise: 'Morning Run', category: 'Cardio', duration: 30, calories: 300 });
      expect(res.status).toBe(201);
      expect(res.body.workout.exercise).toBe('Morning Run');
    });

    it('returns 400 if required fields missing', async () => {
      const res = await request(app).post('/api/fitness').set(auth()).send({ exercise: 'Run' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/fitness/:id', () => {
    it('marks workout as completed', async () => {
      const create = await request(app).post('/api/fitness').set(auth()).send({ exercise: 'Run', category: 'Cardio', duration: 20, calories: 200 });
      const id = create.body.workout._id;
      const res = await request(app).put(`/api/fitness/${id}`).set(auth()).send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.workout.completed).toBe(true);
    });
  });

  describe('DELETE /api/fitness/:id', () => {
    it('deletes a workout', async () => {
      const create = await request(app).post('/api/fitness').set(auth()).send({ exercise: 'Yoga', category: 'Flexibility', duration: 20, calories: 80 });
      const id = create.body.workout._id;
      const res = await request(app).delete(`/api/fitness/${id}`).set(auth());
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/fitness/weekly', () => {
    it('returns 7 days of data', async () => {
      const res = await request(app).get('/api/fitness/weekly').set(auth());
      expect(res.status).toBe(200);
      expect(res.body.weekly).toHaveLength(7);
    });
  });
});
