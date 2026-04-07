const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fitnessEnabled: { type: Boolean, default: true },
  dietEnabled: { type: Boolean, default: true },
  notifications: { type: Boolean, default: true },
  calorieTarget: { type: Number, default: 2000 },
  fitnessCalorieTarget: { type: Number, default: 500 },
  proteinTarget: { type: Number, default: 150 },
  carbsTarget: { type: Number, default: 200 },
  fatsTarget: { type: Number, default: 70 },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
