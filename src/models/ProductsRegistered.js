// src/models/ProductsRegistered.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  publicKey: { type: String, required: true },
  secret: { type: String, required: true },
  seed: { type: String, required: true },
  manufacturerSignature: { type: String, required: true },
  randomSecret: { type: String, required: true },
  transactionHash: { type: String, required: true },
  status: { type: String, default: 'attivo' } 
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;





