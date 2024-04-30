const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const data = JSON.parse(event.body);
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('blockchainProducts');
        const productsCollection = database.collection('products');

        const result = await productsCollection.insertOne(data);
        console.log("Product saved:", result);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Product saved successfully' }),
        };
    } catch (error) {
        console.error('Failed to save product', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save product', error: error.toString() })
        };
    } finally {
        await client.close();
    }
};
