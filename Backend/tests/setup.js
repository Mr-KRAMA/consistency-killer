const mongoose = require('mongoose');

const TEST_URI = 'mongodb://localhost:27017/consistency-killer-test';

const connect = async () => {
  await mongoose.connect(TEST_URI);
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connect, disconnect, clear };
