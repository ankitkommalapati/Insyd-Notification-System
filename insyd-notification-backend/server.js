const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = express.Router();
const User = require('./models/User');
const Notification = require('./models/Notification');
const Event = require('./models/Event');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Insyd Notification System!');
});

router.post('/events', async (req, res) => {
  const { type, sourceUserId, targetUserId, data } = req.body;
  try {
    const newEvent = new Event({ type, sourceUserId, targetUserId, data });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ userId }).populate('userId');
    res.json(notifications);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});