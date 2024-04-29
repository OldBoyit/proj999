// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Definisci le funzioni normalmente
const addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
      walletAddress: req.body.walletAddress
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nella creazione dell'utente", error });
  }
};

module.exports = {
  addUser,
  // elenca altre funzioni qui...
};
