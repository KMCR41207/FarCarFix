const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  nickname:        { type: String, default: '' },
  make:            { type: String, required: true },
  model:           { type: String, required: true },
  variant:         { type: String, default: '' },
  year:            { type: String, required: true },
  regNumber:       { type: String, default: '' },
  fuelType:        { type: String, enum: ['Petrol','Diesel','CNG','Electric','Hybrid'], default: 'Petrol' },
  transmission:    { type: String, enum: ['Manual','Automatic','CVT','AMT'], default: 'Manual' },
  engineType:      { type: String, default: '' },
  color:           { type: String, default: '' },
  odometer:        { type: String, default: '' },
  vin:             { type: String, default: '' },
  insuranceExpiry: { type: String, default: '' },
  pucExpiry:       { type: String, default: '' },
  lastServiceDate: { type: String, default: '' },
  nextServiceDate: { type: String, default: '' },
  isDefault:       { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
