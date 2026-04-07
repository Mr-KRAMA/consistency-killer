const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Work', 'Learning', 'Health', 'Personal'], default: 'Work' },
  plannedTime: { type: Number, required: true, min: 0.5 },
  actualTime: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  isRecurring: { type: Boolean, default: false },
  recurringId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringTask', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
