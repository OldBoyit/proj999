// netlify/functions/producerLogin.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs'); // Assuming password hashing is in use

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const { username, password } = JSON.parse(event.body);
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('blockchainProducts');
        const users = database.collection('producers');

        const user = await users.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid credentials' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login successful', user: { id: user._id, username: user.username } })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to connect to database', error: error.toString() })
        };
    } finally {
        await client.close();
    }
};
