const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'], required: true },
  calories: { type: Number, required: true, min: 1 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  time: { type: String, default: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  logged: { type: Boolean, default: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
