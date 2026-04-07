const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Cardio', 'Weights', 'Flexibility', 'Sports', 'Other'], default: 'Cardio' },
  duration: { type: Number, required: true, min: 1 },
  calories: { type: Number, required: true, min: 1 },
  completed: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
