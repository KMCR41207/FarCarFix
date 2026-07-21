const router = require('express').Router();
const Diagnosis = require('../models/Diagnosis');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const records = await Diagnosis.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(records);
});

router.post('/', async (req, res) => {
  try {
    const record = await Diagnosis.create({ ...req.body, userId: req.userId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const record = await Diagnosis.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true }
    );
    if (!record) return res.status(404).json({ error: 'Record not found.' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Diagnosis.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
