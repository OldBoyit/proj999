// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/ProductsRegistered'); 

router.post('/products/save', async (req, res) => {
  console.log(req.body);  // Aggiungi per vedere esattamente cosa ricevi nel server
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send({ message: 'Product saved successfully' });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).send({ message: 'Failed to save product details', error: error.message });
  }
});

// Endpoint per recuperare prodotti con stato 'attivo'
router.get('/products/active', async (req, res) => {
  try {
    const activeProducts = await Product.find({ status: 'active' });
    res.status(200).json(activeProducts);
  } catch (error) {
    console.error("Error retrieving active products:", error);
    res.status(500).send({ message: 'Failed to get active products', error: error.message });
  }
});

module.exports = router;
