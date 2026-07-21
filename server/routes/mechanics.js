const router = require('express').Router();
const SavedMechanic = require('../models/SavedMechanic');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const mechanics = await SavedMechanic.find({ userId: req.userId });
  res.json(mechanics);
});

router.post('/', async (req, res) => {
  try {
    const mechanic = await SavedMechanic.create({ ...req.body, userId: req.userId });
    res.status(201).json(mechanic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await SavedMechanic.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
