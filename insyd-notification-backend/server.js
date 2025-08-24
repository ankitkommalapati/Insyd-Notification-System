const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Notification = require('./models/Notification');
const Event = require('./models/Event');
const EventHandler = require('./eventProcessor');
const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  return { connection, channel };
};

const processEvents = async () => {
  const { connection, channel } = await connectToRabbitMQ();
  channel.assertQueue('notification_events', { durable: false });
  channel.consume('notification_events', async (msg) => {
    const event = JSON.parse(msg.content.toString());
    try {
      await EventHandler[event.type](event);
      console.log(`Processed event: ${event.type}`);
    } 
    catch (error) {
      console.error('Failed to process event:', error);
    }
  });
};

console.log('Waiting for messages...');

processEvents();

const { processEvents, eventQueue } = require('./eventProcessor');

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

const router = express.Router();

processEvents();

router.post('/events', async (req, res) => {
  const { type, sourceUserId, targetUserId, data } = req.body;
  try {
    const newEvent = new Event({ type, sourceUserId, targetUserId, data });
    await newEvent.save();
    if (eventQueue) {
      eventQueue.push(newEvent.toObject());
    }
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

router.post('/notifications', async (req, res) => {
  const { userId, type, content } = req.body;
  try {
    const notification = new Notification({
      userId: mongoose.Types.ObjectId(userId),
      type,
      content,
    });
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } 
  catch (error) {
    res.status(400).json({ error: 'Invalid userId or missing fields' });
  }
});

module.exports = router;

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});