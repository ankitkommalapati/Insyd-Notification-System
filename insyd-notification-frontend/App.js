import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } 
      catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
  }, []);
  const handleLike = async () => {
    try {
      await axios.post('http://localhost:3001/api/events', {
        type: 'like',
      });
    } 
    catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  const handleComment = async () => {
    try {
      await axios.post('http://localhost:3001/api/events', {
        type: 'comment',
        commentContent,
      });
    } 
    catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };
  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>{notification.content}</li>
        ))}
      </ul>
      <h2>Simulate Events</h2>
      <button onClick={handleLike}>Like Post</button>
      <div>
        <input
          type="text"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Enter comment..."
        />
        <button onClick={handleComment}>Comment on Post</button>
      </div>
    </div>
  );
}

export default App;