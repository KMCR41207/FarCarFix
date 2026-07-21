const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Diagnosis = require('../models/Diagnosis');
const SavedMechanic = require('../models/SavedMechanic');
const Reminder = require('../models/Reminder');
const requireAuth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'farcarfix_secret_change_in_prod';
const JWT_EXPIRES = '30d';

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const user = new User({ fullName, email, phone: phone || '', passwordHash: password });
    await user.save();

    // seed sample data
    const now = new Date().toISOString();
    const vehicle = await Vehicle.create({
      userId: user._id, nickname: 'My Car', make: 'Toyota', model: 'Camry',
      variant: 'XLE', year: '2019', regNumber: 'DL 01 AB 1234',
      fuelType: 'Petrol', transmission: 'Automatic', engineType: '2.5L 4-Cyl',
      color: 'Silver', odometer: '48500', insuranceExpiry: '2027-01-15',
      pucExpiry: '2025-12-01', lastServiceDate: '2026-01-12',
      nextServiceDate: '2026-07-12', isDefault: true,
    });
    await Reminder.insertMany([
      { userId: user._id, vehicleId: vehicle._id, type: 'Oil Change', dueDate: '2026-08-01' },
      { userId: user._id, vehicleId: vehicle._id, type: 'PUC Renewal', dueDate: '2025-12-01' },
      { userId: user._id, vehicleId: vehicle._id, type: 'Insurance Renewal', dueDate: '2027-01-15' },
      { userId: user._id, vehicleId: vehicle._id, type: 'Next Service Due', dueDate: '2026-07-12' },
    ]);
    await SavedMechanic.insertMany([
      { userId: user._id, name: 'Sharma Auto Works', specialty: 'Brakes & Suspension', rating: 4.8, phone: '+91 98001 12345' },
      { userId: user._id, name: 'PremiumCare Auto', specialty: 'Engine & Electrical', rating: 4.6, phone: '+91 99887 56789' },
    ]);

    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'Server error during sign up.' });
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Incorrect password.' });
    const token = signToken(user._id.toString());
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('signin error', err);
    res.status(500).json({ error: 'Server error during sign in.' });
  }
});

// GET /api/auth/me — restore session
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const [vehicles, diagnosisHistory, savedMechanics, reminders] = await Promise.all([
      Vehicle.find({ userId: req.userId }).sort({ createdAt: 1 }),
      Diagnosis.find({ userId: req.userId }).sort({ createdAt: -1 }),
      SavedMechanic.find({ userId: req.userId }),
      Reminder.find({ userId: req.userId }),
    ]);
    res.json({ user: user.toSafeObject(), vehicles, diagnosisHistory, savedMechanics, reminders });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { fullName, phone, city, profileImage, preferences } = req.body;
    const update = {};
    if (fullName !== undefined) update.fullName = fullName;
    if (phone !== undefined) update.phone = phone;
    if (city !== undefined) update.city = city;
    if (profileImage !== undefined) update.profileImage = profileImage;
    if (preferences !== undefined) update.preferences = preferences;
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
