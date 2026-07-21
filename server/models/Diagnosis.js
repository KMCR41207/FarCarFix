const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vehicleId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  date:             { type: String, default: '' },
  issueDescription: { type: String, default: '' },
  uploadedImages:   [{ type: String }],
  aiDiagnosis:      { type: String, default: '' },
  confidenceScore:  { type: Number, default: 0 },
  diySteps:         [{ type: String }],
  estimatedCost: {
    diy:        { type: String, default: '' },
    local:      { type: String, default: '' },
    authorized: { type: String, default: '' },
  },
  severity:      { type: String, enum: ['low','medium','high','critical'], default: 'low' },
  mechanicBooked:{ type: Boolean, default: false },
  mechanicName:  { type: String, default: '' },
  repairStatus:  { type: String, enum: ['pending','in_progress','completed','cancelled'], default: 'pending' },
  finalNotes:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
