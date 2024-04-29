// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true },
  role: { type: String, enum: ['admin', 'producer'], required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;


