// src/routes/DigitalSignatures.js
const express = require('express');
const router = express.Router();

// Assicurati che DigitalSignature sia il modello Mongoose corretto
const DigitalSignature = require('../models/DigitalSignature');

router.post('/', async (req, res) => {
  const { creator, signatureData } = req.body;
  try {
    const newSignature = new DigitalSignature({
      creator: creator,
      signatureData: signatureData
    });
    await newSignature.save();
    res.status(201).json(newSignature);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const signatures = await DigitalSignature.find();
    res.json(signatures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await DigitalSignature.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
