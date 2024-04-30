// src/models/Key.js
const mongoose = require('mongoose');

const chiaveSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  privateKey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['disponibile', 'assegnata', 'ritirata'],
    default: 'disponibile'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Chiave', chiaveSchema);
