// src/routes/producerRoutes.js
const express = require('express');
const Producer = require('../models/Producer'); // Assicurati che il percorso sia corretto
const bcrypt = require('bcrypt');
const router = express.Router();

// Login route for producers
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const producer = await Producer.findOne({ username });
        if (!producer) {
            return res.status(404).json({ message: "Producer not found" });
        }
        const isMatch = await bcrypt.compare(password, producer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Here you might want to create a token or session, depending on your auth strategy
        res.json({ message: "Login successful", producer: producer });
    } catch (error) {
        console.error("Error on producer login:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, walletAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newProducer = new Producer({
      username,
      password: hashedPassword,
      walletAddress
    });
    await newProducer.save();
    res.status(201).json({ message: "Produttore registrato correttamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella registrazione del produttore", error: error.message });
  }
});

// Ottieni tutti i produttori
router.get('/', async (req, res) => {
    try {
        const producers = await Producer.find({});
        res.json(producers);
    } catch (error) {
        console.error("Error fetching producers:", error);
        res.status(500).json({ message: "Errore nel recupero dei produttori" });
    }
});

// Elimina un produttore
router.delete('/:id', async (req, res) => {
    try {
        const producer = await Producer.findByIdAndDelete(req.params.id);
        if (!producer) {
            return res.status(404).send('Produttore non trovato');
        }
        res.status(200).send('Produttore eliminato');
    } catch (error) {
        console.error("Error deleting producer:", error);
        res.status(500).json({ message: "Errore nell'eliminazione del produttore" });
    }
});

module.exports = router;
