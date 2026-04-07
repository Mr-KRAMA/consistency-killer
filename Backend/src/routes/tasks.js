const router = require('express').Router();
const Task = require('../models/Task');
const RecurringTask = require('../models/RecurringTask');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/tasks?date=YYYY-MM-DD
// Also auto-seeds today's tasks from recurring templates
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Auto-seed recurring tasks for this date if not already seeded
    const recurring = await RecurringTask.find({ user: req.user._id });
    for (const rt of recurring) {
      const exists = await Task.findOne({ user: req.user._id, recurringId: rt._id, date });
      if (!exists) {
        await Task.create({
          user: req.user._id,
          title: rt.title,
          category: rt.category,
          plannedTime: rt.plannedTime,
          date,
          isRecurring: true,
          recurringId: rt._id,
        });
      }
    }

    const tasks = await Task.find({ user: req.user._id, date }).sort({ isRecurring: -1, createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, category, plannedTime, date, isRecurring } = req.body;
    if (!title || !plannedTime) {
      return res.status(400).json({ message: 'Title and plannedTime are required' });
    }

    let recurringId = null;

    // If marked as recurring, save to RecurringTask templates too
    if (isRecurring) {
      const rt = await RecurringTask.create({ user: req.user._id, title, category, plannedTime });
      recurringId = rt._id;
    }

    const taskDate = date || new Date().toISOString().split('T')[0];
    const task = await Task.create({
      user: req.user._id,
      title,
      category,
      plannedTime,
      date: taskDate,
      isRecurring: !!isRecurring,
      recurringId,
    });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id — only allow safe fields
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['title', 'category', 'plannedTime', 'actualTime', 'completed'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
// If recurring, also removes the recurring template (stops future seeding)
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.recurringId) {
      await RecurringTask.findOneAndDelete({ _id: task.recurringId, user: req.user._id });
      // Remove all future unseeded copies won't exist yet, but remove today's other copies if any
    }

    res.json({ message: 'Task deleted', wasRecurring: !!task.recurringId });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/recurring  — list all recurring templates
router.get('/recurring', async (req, res, next) => {
  try {
    const recurring = await RecurringTask.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ recurring });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/recurring/:id  — delete recurring template only (keeps today's task)
router.delete('/recurring/:id', async (req, res, next) => {
  try {
    const rt = await RecurringTask.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!rt) return res.status(404).json({ message: 'Recurring task not found' });
    res.json({ message: 'Recurring task removed. Will no longer appear daily.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
