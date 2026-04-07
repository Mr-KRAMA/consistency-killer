const router = require('express').Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/fitness?date=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.date) filter.date = req.query.date;
    const workouts = await Workout.find(filter).sort({ createdAt: -1 });
    res.json({ workouts });
  } catch (err) {
    next(err);
  }
});

// GET /api/fitness/weekly  — last 7 days calorie summary
router.get('/weekly', async (req, res, next) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    const results = await Promise.all(
      days.map(async (date) => {
        const workouts = await Workout.find({ user: req.user._id, date, completed: true });
        const burned = workouts.reduce((s, w) => s + w.calories, 0);
        return { day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), burned, target: 500 };
      })
    );
    res.json({ weekly: results });
  } catch (err) {
    next(err);
  }
});

// POST /api/fitness
router.post('/', async (req, res, next) => {
  try {
    const { exercise, category, duration, calories, date } = req.body;
    if (!exercise || !duration || !calories) {
      return res.status(400).json({ message: 'exercise, duration and calories are required' });
    }
    const workout = await Workout.create({ user: req.user._id, exercise, category, duration, calories, date });
    res.status(201).json({ workout });
  } catch (err) {
    next(err);
  }
});

// PUT /api/fitness/:id — only allow safe fields
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['exercise', 'category', 'duration', 'calories', 'completed'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ workout });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/fitness/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
