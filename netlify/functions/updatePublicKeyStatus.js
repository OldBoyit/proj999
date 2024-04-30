const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const data = JSON.parse(event.body);
    const publicKeyId = data.publicKeyId;
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('blockchainProducts');
        const keysCollection = database.collection('chiaves');

        const result = await keysCollection.updateOne({ _id: publicKeyId }, { $set: { used: true } });
        console.log("Public key status updated:", result);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Public key status updated successfully' }),
        };
    } catch (error) {
        console.error('Failed to update public key status', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update public key status', error: error.toString() })
        };
    } finally {
        await client.close();
    }
};
