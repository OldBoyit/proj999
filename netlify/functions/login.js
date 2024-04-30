const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully connected to MongoDB' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to MongoDB', details: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  } finally {
    await client.close();
  }
};
