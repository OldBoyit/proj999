const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true }
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = Producer;
