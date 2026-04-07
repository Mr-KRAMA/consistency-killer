const mongoose = require('mongoose');

const recurringTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Work', 'Learning', 'Health', 'Personal'], default: 'Work' },
  plannedTime: { type: Number, required: true, min: 0.5 },
}, { timestamps: true });

module.exports = mongoose.model('RecurringTask', recurringTaskSchema);
