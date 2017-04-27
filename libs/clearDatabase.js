const promisify = require('es6-promisify');
const assert = require('assert');
const mongoose = require('./mongoose');

module.exports = function* clearDatabase() {

  if (mongoose.connection.readyState == 2) { // connecting
    yield promisify(cb => mongoose.connection.on('open', cb))();
  }
  assert(mongoose.connection.readyState == 1);

  const db = mongoose.connection.db;

  let collections = yield promisify(cb => db.listCollections().toArray(cb))();

  collections = collections
    .filter(coll => !coll.name.startsWith('system.'))
    .map(coll => db.collection(coll.name)); // plain object with info => collection object

  yield Promise.all(
    // collections.map(coll => promisify(cb => coll.drop(cb))())
    collections.map(coll => promisify(coll.drop, coll)())
  );

  yield Promise.all(mongoose.modelNames().map(function(modelName) {
    const model = mongoose.model(modelName);
    return promisify(cb => model.ensureIndexes(cb))();
  }));
};
