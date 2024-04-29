// src/models/DigitalSignature.js
const mongoose = require('mongoose');

const digitalSignatureSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true // Assicura che il creatore sia sempre fornito
  },
  signatureData: {
    type: String,
    required: true // Assicura che i dati della firma siano sempre forniti
  },
  created: {
    type: Date,
    default: Date.now  // Imposta automaticamente la data corrente
  }
});

module.exports = mongoose.model('DigitalSignature', digitalSignatureSchema);
