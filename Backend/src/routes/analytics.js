const router = require('express').Router();
const Task = require('../models/Task');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/analytics/weekly  — 7-day consistency scores + task/hour data
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
        const tasks = await Task.find({ user: req.user._id, date });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const score = total > 0 ? Math.round((completed / total) * 100) : 0;
        const hours = tasks.filter((t) => t.completed).reduce((s, t) => s + t.actualTime, 0);
        return {
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          score,
          tasks: completed,
          hours: parseFloat(hours.toFixed(1)),
        };
      })
    );
    res.json({ weekly: results });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/monthly  — last 4 weeks average scores
router.get('/monthly', async (req, res, next) => {
  try {
    const weeks = [];
    for (let w = 3; w >= 0; w--) {
      const weekDays = [];
      for (let d = 6; d >= 0; d--) {
        const date = new Date();
        date.setDate(date.getDate() - w * 7 - d);
        weekDays.push(date.toISOString().split('T')[0]);
      }
      weeks.push(weekDays);
    }

    const results = await Promise.all(
      weeks.map(async (weekDays, idx) => {
        const tasks = await Task.find({ user: req.user._id, date: { $in: weekDays } });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const score = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { week: `Week ${idx + 1}`, score, tasks: completed, hours: 0 };
      })
    );
    res.json({ monthly: results });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/category  — task breakdown by category
router.get('/category', async (req, res, next) => {
  try {
    const COLORS = { Work: '#ef4444', Learning: '#eab308', Health: '#22c55e', Personal: '#3b82f6' };
    const categories = ['Work', 'Learning', 'Health', 'Personal'];
    const results = await Promise.all(
      categories.map(async (cat) => {
        const count = await Task.countDocuments({ user: req.user._id, category: cat });
        return { name: cat, value: count, color: COLORS[cat] };
      })
    );
    res.json({ categories: results.filter((c) => c.value > 0) });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/dashboard  — today's summary for the dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const tasks = await Task.find({ user: req.user._id, date: today });
    const tasksCompleted = tasks.filter((t) => t.completed).length;
    const tasksPlanned = tasks.length;
    const hoursPlanned = tasks.reduce((s, t) => s + t.plannedTime, 0);
    const hoursActual = tasks.filter((t) => t.completed).reduce((s, t) => s + t.actualTime, 0);
    const todayScore = tasksPlanned > 0 ? Math.round((tasksCompleted / tasksPlanned) * 100) : 0;

    const workouts = await Workout.find({ user: req.user._id, date: today });
    const caloriesBurned = workouts.filter((w) => w.completed).reduce((s, w) => s + w.calories, 0);
    const workoutsCompleted = workouts.filter((w) => w.completed).length;
    const workoutsPlanned = workouts.length;

    const meals = await Meal.find({ user: req.user._id, date: today, logged: true });
    const caloriesConsumed = meals.reduce((s, m) => s + m.calories, 0);

    // Streak: consecutive days with score >= 50
    let exerciseStreak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayWorkouts = await Workout.find({ user: req.user._id, date: dateStr, completed: true });
      if (dayWorkouts.length > 0) exerciseStreak++;
      else break;
    }

    res.json({
      todayScore,
      tasksCompleted,
      tasksPlanned,
      hoursPlanned: parseFloat(hoursPlanned.toFixed(1)),
      hoursActual: parseFloat(hoursActual.toFixed(1)),
      caloriesBurned,
      workoutsCompleted,
      workoutsPlanned,
      caloriesConsumed,
      exerciseStreak,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
