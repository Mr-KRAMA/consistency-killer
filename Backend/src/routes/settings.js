const router = require('express').Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });
    if (!settings) settings = await Settings.create({ user: req.user._id });
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings
router.put('/', async (req, res, next) => {
  try {
    const allowed = ['fitnessEnabled', 'dietEnabled', 'notifications', 'calorieTarget', 'fitnessCalorieTarget', 'proteinTarget', 'carbsTarget', 'fatsTarget'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const settings = await Settings.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
