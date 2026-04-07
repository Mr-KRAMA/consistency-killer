const router = require('express').Router();
const Task = require('../models/Task');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/reports/weekly  — weekly report card
router.get('/weekly', async (req, res, next) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const tasks = await Task.find({ user: req.user._id, date: { $in: days } });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Grade
    let grade = 'F';
    if (completionRate >= 90) grade = 'A';
    else if (completionRate >= 80) grade = 'B';
    else if (completionRate >= 70) grade = 'C';
    else if (completionRate >= 60) grade = 'D';

    // Failures: incomplete tasks
    const failures = tasks
      .filter((t) => !t.completed)
      .map((t) => ({
        task: t.title,
        planned: `${t.plannedTime}h`,
        actual: `${t.actualTime}h`,
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));

    // Patterns
    const weekendDays = days.filter((d) => [0, 6].includes(new Date(d).getDay()));
    const weekdayDays = days.filter((d) => ![0, 6].includes(new Date(d).getDay()));

    const weekendTasks = tasks.filter((t) => weekendDays.includes(t.date));
    const weekdayTasks = tasks.filter((t) => weekdayDays.includes(t.date));

    const weekendRate = weekendTasks.length > 0
      ? Math.round((weekendTasks.filter((t) => t.completed).length / weekendTasks.length) * 100)
      : 100;
    const weekdayRate = weekdayTasks.length > 0
      ? Math.round((weekdayTasks.filter((t) => t.completed).length / weekdayTasks.length) * 100)
      : 100;

    const hoursLogged = tasks.filter((t) => t.completed).reduce((s, t) => s + t.actualTime, 0);

    res.json({
      grade,
      completionRate,
      totalTasks,
      completedTasks,
      hoursLogged: parseFloat(hoursLogged.toFixed(1)),
      failures,
      weekendRate,
      weekdayRate,
      improvements: [
        { area: 'Task Completion', current: `${completionRate}%`, target: '90%', priority: completionRate < 60 ? 'CRITICAL' : 'HIGH' },
        { area: 'Weekend Discipline', current: `${weekendRate}%`, target: '75%', priority: weekendRate < 50 ? 'URGENT' : 'MEDIUM' },
      ],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
