const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  preferences: { type: Object, default: {} },
});

module.exports = mongoose.model('User', userSchema);