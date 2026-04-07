const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect, clear } = require('./setup');

let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  await connect();
  const res = await request(app).post('/api/auth/register').send({ name: 'User', email: 'u@t.com', password: 'pass1234' });
  token = res.body.token;
});
afterEach(async () => {
  const Task = require('../src/models/Task');
  await Task.deleteMany({});
});
afterAll(async () => await disconnect());

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Tasks Routes', () => {
  describe('GET /api/tasks', () => {
    it('returns empty array initially', async () => {
      const res = await request(app).get('/api/tasks').set(auth());
      expect(res.status).toBe(200);
      expect(res.body.tasks).toEqual([]);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(auth())
        .send({ title: 'Write tests', category: 'Work', plannedTime: 2 });
      expect(res.status).toBe(201);
      expect(res.body.task.title).toBe('Write tests');
      expect(res.body.task.completed).toBe(false);
    });

    it('returns 400 if title is missing', async () => {
      const res = await request(app).post('/api/tasks').set(auth()).send({ plannedTime: 1 });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('marks task as completed', async () => {
      const create = await request(app).post('/api/tasks').set(auth()).send({ title: 'Task', plannedTime: 1 });
      const id = create.body.task._id;
      const res = await request(app).put(`/api/tasks/${id}`).set(auth()).send({ completed: true, actualTime: 0.8 });
      expect(res.status).toBe(200);
      expect(res.body.task.completed).toBe(true);
    });

    it('returns 404 for non-existent task', async () => {
      const res = await request(app).put('/api/tasks/000000000000000000000000').set(auth()).send({ completed: true });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task', async () => {
      const create = await request(app).post('/api/tasks').set(auth()).send({ title: 'Delete me', plannedTime: 1 });
      const id = create.body.task._id;
      const res = await request(app).delete(`/api/tasks/${id}`).set(auth());
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/000000000000000000000000').set(auth());
      expect(res.status).toBe(404);
    });
  });
});
