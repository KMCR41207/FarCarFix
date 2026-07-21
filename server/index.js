require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes      = require('./routes/auth');
const vehicleRoutes   = require('./routes/vehicles');
const diagnosisRoutes = require('./routes/diagnosis');
const bookingRoutes   = require('./routes/bookings');
const mechanicRoutes  = require('./routes/mechanics');
const reminderRoutes  = require('./routes/reminders');

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // allow base64 images

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests. Try again later.' } });
app.use('/api/', limiter);
app.use('/api/auth/signin', authLimiter);
app.use('/api/auth/signup', authLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/vehicles',  vehicleRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/reminders', reminderRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGODB_URI not set in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('\n🔧 Checklist:');
    console.error('   1. Is MONGODB_URI correct in .env?');
    console.error('   2. Is the DB password correct in Atlas?');
    console.error('   3. Is your IP whitelisted in Atlas → Network Access?');
    console.error('      Add 0.0.0.0/0 to allow all IPs during development.\n');
    process.exit(1);
  });
