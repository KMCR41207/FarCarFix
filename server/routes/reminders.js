const router = require('express').Router();
const Reminder = require('../models/Reminder');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const reminders = await Reminder.find({ userId: req.userId });
  res.json(reminders);
});

router.post('/', async (req, res) => {
  try {
    const reminder = await Reminder.create({ ...req.body, userId: req.userId });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/dismiss', async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isDismissed: true }, { new: true }
    );
    res.json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
