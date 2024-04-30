const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;  // Assicurati di configurare questa variabile d'ambiente in Netlify

exports.handler = async function(event, context) {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('blockchainProducts');
    const collection = db.collection('digitalsignatures');

    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" })
      };
    }

    const signatures = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(signatures)
    };

  } catch (error) {
    console.error('Failed to connect to the database', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to connect to the database" })
    };
  } finally {
    await client.close();
  }
};
