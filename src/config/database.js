const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI; 

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;

