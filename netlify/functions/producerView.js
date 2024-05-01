// netlify/functions/producerView.js
// netlify/functions/producerView.js
const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (event.httpMethod === 'POST') {
        // Logica di autenticazione esistente
        const { username, password } = JSON.parse(event.body);
        try {
            await client.connect();
            const database = client.db('blockchainProducts');
            const users = database.collection('producers');
            const user = await users.findOne({ username });
            const bcrypt = require('bcryptjs');

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
    } else if (event.httpMethod === 'GET') {
        // Logica per restituire i produttori
        try {
            await client.connect();
            const database = client.db('blockchainProducts');
            const producers = database.collection('producers');
            const producerList = await producers.find({}).toArray();

            return {
                statusCode: 200,
                body: JSON.stringify(producerList)
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to fetch producers', error: error.toString() })
            };
        } finally {
            await client.close();
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};
