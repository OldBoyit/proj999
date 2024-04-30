const { MongoClient } = require('mongodb');

function setCorsHeaders(headers) {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        ...headers
    };
}

exports.handler = async (event) => {
  // Handle the OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: setCorsHeaders({ 'Content-Type': 'application/json' }),  // Ensure content type is also set if needed
      body: ''
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: setCorsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ error: 'Missing request body' })
    };
  }

  const { username, password } = JSON.parse(event.body);
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('blockchainProducts');
    const users = database.collection('users');

    const user = await users.findOne({ username });
    if (!user) {
      return {
        statusCode: 404,
        headers: setCorsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    if (password === user.password) {
      return {
        statusCode: 200,
        headers: setCorsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message: 'Login successful', user: { id: user._id, username: user.username } })
      };
    } else {
      return {
        statusCode: 401,
        headers: setCorsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }
  } catch ( error ) {
    console.error("Error connecting to MongoDB", error);
    return {
      statusCode: 500,
      headers: setCorsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ error: 'Failed to connect to database', details: error.toString() })
    };
  } finally {
    await client.close();
  }
};
