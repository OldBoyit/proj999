const { MongoClient } = require('mongodb');

const handler = async (event) => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  let result = null;

  try {
    await client.connect();
    const database = client.db('blockchainProducts');

    // Assumi che il parametro 'collezione' venga passato come query string nell'URL della funzione
    const collezione = event.queryStringParameters.collezione;
    if (!collezione) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No collection specified' }),
      };
    }

    const collection = database.collection(collezione);

    // Qui puoi aggiungere diversi tipi di operazioni a seconda del contesto
    // Esempio: ottiene tutti i documenti dalla collezione specificata
    result = await collection.find({}).toArray();

  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to database' }),
    };
  } finally {
    await client.close();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

module.exports = { handler };
