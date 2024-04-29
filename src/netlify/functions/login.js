const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('blockchainProducts');
    const users = database.collection('users');

    const user = await users.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful' }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Adjust as necessary for production
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Adjust as necessary for production
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      };
    }
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to database' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust as necessary for production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  } finally {
    await client.close();
  }
};
