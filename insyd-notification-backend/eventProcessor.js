const Notification = require('./models/Notification');
const User = require('./models/User');

const eventHandlers = {
  like: async (event) => {
    const { sourceUserId, targetUserId, postId } = event;
    const notification = new Notification({
      userId: targetUserId,
      type: 'like',
      content: `${sourceUserId} liked your post.`,
    });
    await notification.save();
  },
  comment: async (event) => {
    const { sourceUserId, targetUserId, postId, commentContent } = event;
    const notification = new Notification({
      userId: targetUserId,
      type: 'comment',
      content: `${sourceUserId} commented on your post: ${commentContent}`,
    });
    await notification.save();
  },
  follow: async (event) => {
    const { followerId, followeeId } = event;
    const notification = new Notification({
      userId: followeeId,
      type: 'follow',
      content: `${followerId} started following you.`,
    });
    await notification.save();
  },
};

module.exports = eventHandlers;