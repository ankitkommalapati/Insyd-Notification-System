const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);