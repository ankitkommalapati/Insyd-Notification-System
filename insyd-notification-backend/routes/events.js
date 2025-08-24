const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/', async (req, res) => {
  const { type, sourceUserId, targetUserId, data } = req.body;
  try {
    const newEvent = new Event({ type, sourceUserId, targetUserId, data });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;