const router = require('express').Router();
const Booking = require('../models/Booking');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(bookings);
});

router.post('/', async (req, res) => {
  try {
    const refNo = 'FCF-' + Date.now().toString(36).toUpperCase();
    const booking = await Booking.create({ ...req.body, userId: req.userId, referenceNo: refNo });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
