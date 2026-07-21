const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, default: '' },
  passwordHash: { type: String, required: true },
  profileImage: { type: String, default: '' },
  city:         { type: String, default: '' },
  preferences: {
    notifications:    { type: Boolean, default: true },
    locationServices: { type: Boolean, default: true },
    whatsappAlerts:   { type: Boolean, default: false },
    emailDigest:      { type: Boolean, default: true },
    darkMode:         { type: Boolean, default: false },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
