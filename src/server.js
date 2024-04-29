// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const producerRoutes = require('./routes/producerRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const { authorizeRoles } = require('./middleware/rolesMiddleware');
const keyRoutes = require('./routes/keyRoutes'); 
const digitalSignaturesRouter = require('./routes/DigitalSignatures');
const productRoutes = require('./routes/productRoutes');

// Inizializzazione dell'app Express
const app = express();

// Utilizzo dei middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', productRoutes);
app.use('/api/keys', keyRoutes);  
app.post('/api/secret-route', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.send("Accesso consentito alla secret route");
});
app.use('/api/producers', producerRoutes);
app.use('/api/digital-signatures', digitalSignaturesRouter);

// Connessione a MongoDB
mongoose.connect('mongodb+srv://brugognonedavide:Biagio2023@cluster0.aswrnpv.mongodb.net/blockchainProducts?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Definizione della porta e avvio del server
const PORT = process.env.PORT || 3001;  // Usa la porta 3001 come default se PORT non è definito nell'ambiente
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



