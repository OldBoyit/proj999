// netlify/functions/manageProduct.js
const { MongoClient } = require('mongodb');

// URI per connettersi al database MongoDB
const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
  try {
    // Evita di riutilizzare la connessione in contesti diversi
    context.callbackWaitsForEmptyEventLoop = false;
    
    await client.connect();
    const db = client.db('blockchainProducts');
    const collection = db.collection('products');

    // Controlla il tipo di richiesta HTTP
    if (event.httpMethod === 'POST') {
      // Aggiungi un nuovo prodotto
      const product = JSON.parse(event.body);
      const response = await collection.insertOne(product);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Product added successfully", data: response })
      };
    } else if (event.httpMethod === 'GET') {
      // Recupera tutti i prodotti
      const products = await collection.find({}).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify({ products })
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" })
      };
    }
  } catch (error) {
    console.error("Database connection error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
