// src/routes/keyRoutes.js
const express = require('express');
const router = express.Router();
const Key = require('../models/Key');

// Create a new key
router.post('/', async (req, res) => {
  const { publicKey, privateKey } = req.body;
  try {
    const newKey = new Key({
      publicKey,
      privateKey
    });
    await newKey.save();
    res.status(201).json(newKey);
  } catch (error) {
    console.error("Error saving the key:", error);
    res.status(500).json({ message: "Error saving the key", error: error.toString() }); 
  }
});

// GET request to fetch all keys
router.get('/', async (req, res) => {
  try {
    const keys = await Key.find({});
    res.json(keys);
  } catch (error) {
    console.error("Fetch Keys Error:", error);
    res.status(500).json({ message: "Error fetching keys", error: error.message || 'Unknown Error' });
  }
});

// GET request to fetch available keys
router.get('/available', async (req, res) => {
  try {
    const availableKeys = await Key.find({ status: 'disponibile' });
    res.json(availableKeys);
  } catch (error) {
    console.error("Fetch Available Keys Error:", error);
    res.status(500).json({ message: "Error fetching available keys", error: error.message || 'Unknown Error' });
  }
});

// GET request to fetch assigned (non-available) keys
router.get('/assigned', async (req, res) => {
  try {
    const nonAvailableKeys = await Key.find({ status: { $ne: 'disponibile' } })
                                      .populate('assignedProducts'); // Assicurati che 'assignedProducts' sia un campo valido nel tuo schema Key, se vuoi usare populate
    res.json(nonAvailableKeys);
  } catch (error) {
    console.error("Fetch Assigned Keys Error:", error);
    res.status(500).json({ message: "Error fetching assigned keys", error: error.message || 'Unknown Error' });
  }
});

// POST request to mark a key as used
router.post('/mark-used', async (req, res) => {
  const { publicKeyId } = req.body;  // Assumi che publicKeyId sia l'identificatore della chiave da aggiornare
  try {
    const updatedKey = await Key.findByIdAndUpdate(
      publicKeyId,
      { $set: { status: 'utilizzata' } },
      { new: true }  // Imposta a true per restituire il documento aggiornato
    );
    if (!updatedKey) {
      return res.status(404).json({ message: "Key not found" });
    }
    res.status(200).json(updatedKey);
  } catch (error) {
    console.error("Error updating the key status:", error);
    res.status(500).json({ message: "Error updating the key status", error: error.toString() });
  }
});

module.exports = router;


