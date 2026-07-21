const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// GET all vehicles for user
router.get('/', async (req, res) => {
  const vehicles = await Vehicle.find({ userId: req.userId }).sort({ createdAt: 1 });
  res.json(vehicles);
});

// POST create vehicle
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, userId: req.userId };
    // if first vehicle, set as default
    const count = await Vehicle.countDocuments({ userId: req.userId });
    if (count === 0) data.isDefault = true;
    const vehicle = await Vehicle.create(data);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body, { new: true }
    );
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    // reassign default if needed
    const remaining = await Vehicle.find({ userId: req.userId });
    if (remaining.length > 0 && !remaining.some(v => v.isDefault)) {
      remaining[0].isDefault = true;
      await remaining[0].save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT set default
router.put('/:id/default', async (req, res) => {
  try {
    await Vehicle.updateMany({ userId: req.userId }, { isDefault: false });
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isDefault: true }, { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
