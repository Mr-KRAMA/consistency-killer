const router = require('express').Router();
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/diet?date=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.date) filter.date = req.query.date;
    const meals = await Meal.find(filter).sort({ createdAt: 1 });
    res.json({ meals });
  } catch (err) {
    next(err);
  }
});

// GET /api/diet/weekly — last 7 days calorie summary
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
        const meals = await Meal.find({ user: req.user._id, date, logged: true });
        const consumed = meals.reduce((s, m) => s + m.calories, 0);
        return { day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), consumed, target: 2000 };
      })
    );
    res.json({ weekly: results });
  } catch (err) {
    next(err);
  }
});

// POST /api/diet
router.post('/', async (req, res, next) => {
  try {
    const { name, type, calories, protein, carbs, fats, date } = req.body;
    if (!name || !type || !calories) {
      return res.status(400).json({ message: 'name, type and calories are required' });
    }
    const meal = await Meal.create({ user: req.user._id, name, type, calories, protein, carbs, fats, date });
    res.status(201).json({ meal });
  } catch (err) {
    next(err);
  }
});

// PUT /api/diet/:id — only allow safe fields
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['name', 'type', 'calories', 'protein', 'carbs', 'fats', 'logged'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ meal });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/diet/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
