const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  diagnosisId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnosis' },
  vehicleId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  ownerName:    { type: String, default: '' },
  phone:        { type: String, default: '' },
  email:        { type: String, default: '' },
  address:      { type: String, default: '' },
  serviceType:  { type: String, default: '' },
  mechanicId:   { type: String, default: '' },
  mechanicName: { type: String, default: '' },
  scheduledDate:{ type: String, default: '' },
  scheduledTime:{ type: String, default: '' },
  notes:        { type: String, default: '' },
  status:       { type: String, enum: ['pending','confirmed','in_progress','completed','cancelled'], default: 'pending' },
  eta:          { type: String, default: '' },
  finalCost:    { type: String, default: '' },
  referenceNo:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
