const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('blockchainProducts');
    const productsCollection = database.collection('products');

    const products = await productsCollection.find({ status: 'attivo' }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Failed to connect to database', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to connect to database', error: error.toString() })
    };
  } finally {
    await client.close();
  }
};
