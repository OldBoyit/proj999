const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  if (!event.body) return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };

  const { username, password } = JSON.parse(event.body);
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('blockchainProducts');
    const users = database.collection('users');

    const user = await users.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } }); // Case insensitive search
    if (!user) {
      console.log('User not found:', username);
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    if (password === user.password) {
      console.log('Login successful for user:', username);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', user: { id: user._id, username: user.username } }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      };
    } else {
      console.log('Invalid credentials for user:', username);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      };
    }
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to database', detail: error.toString() }),
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
