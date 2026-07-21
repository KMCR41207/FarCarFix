const mongoose = require('mongoose');

const savedMechanicSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:      { type: String, required: true },
  specialty: { type: String, default: '' },
  rating:    { type: Number, default: 0 },
  phone:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SavedMechanic', savedMechanicSchema);
