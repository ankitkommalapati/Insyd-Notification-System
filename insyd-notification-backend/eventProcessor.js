const Notification = require('./models/Notification');
const User = require('./models/User');

const eventQueue = [];

function processEvents() {
  setInterval(() => {
    if (eventQueue.length > 0) {
      const event = eventQueue.shift();
      generateNotification(event);
    }
  }, 1000);
}

function generateNotification(event) {
  const { type, sourceUserId, targetUserId, data } = event;
  User.findById(targetUserId)
    .then((user) => {
      if (!user) {
        console.error('User not found for notification');
        return;
      }
      const notification = new Notification({
        userId: targetUserId,
        type,
        content: `${user.username} ${generateNotificationContent(type, data)}`,
      });
      return notification.save();
    })
    .then(() => {
      console.log('Notification generated successfully');
    })
    .catch((error) => {
      console.error('Failed to generate notification', error);
    });
}

function generateNotificationContent(type, data) {
  switch (type) {
    case 'like':
      return `liked your post "${data.postTitle}"`;
    case 'comment':
      return `commented on your post "${data.postTitle}"`;
    case 'follow':
      return `started following you`;
    default:
      return '';
  }
}

module.exports = { processEvents };