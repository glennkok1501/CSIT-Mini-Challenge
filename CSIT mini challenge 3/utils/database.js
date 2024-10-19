const { MongoClient } = require("mongodb");

const uri = 'mongodb+srv://userReadOnly:7ZT817O8ejDfhnBM@minichallenge.q4nve1r.mongodb.net';

const client = new MongoClient(uri);

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to remote database");

  } catch (error) {
    console.log(error);
  }
};

const getDatabase = () => {
    const db = client.db('minichallenge')
    return db;
};

module.exports.init = init;
module.exports.getDatabase = getDatabase;