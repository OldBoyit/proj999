const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('blockchainProducts');
        const keysCollection = database.collection('chiaves');

        const keys = await keysCollection.find({isActive: true, status: "ritirata"}).toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(keys),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
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
