const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Funzione separata per autenticare l'utente
async function authenticateUser(username, password, uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db('blockchainProducts');
        const users = database.collection('users');

        const user = await users.findOne({ username: username });
        if (!user) return null;

        const passwordIsValid = await bcrypt.compare(password, user.password);
        return passwordIsValid ? user : null;
    } catch (error) {
        console.error("Error accessing the database", error);
        throw new Error('Database access failed');
    } finally {
        await client.close();
    }
}

// Handler della funzione Netlify
exports.handler = async (event) => {
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    const { username, password } = JSON.parse(event.body);
    const uri = process.env.MONGO_URI;

    try {
        const user = await authenticateUser(username, password, uri);
        if (user) {
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
        console.error("Error during authentication", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Authentication process failed' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            }
        };
    }
};
