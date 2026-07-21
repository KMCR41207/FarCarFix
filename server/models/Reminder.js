const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vehicleId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  type:        { type: String, required: true },
  dueDate:     { type: String, default: '' },
  isDismissed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
