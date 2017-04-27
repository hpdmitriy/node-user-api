const fs = require('fs');
const co = require('co');
const path = require('path');
const root = require('config').root;
const mongoose = require('../libs/mongoose');
const loadModels = require('../libs/loadModels');
const clearDatabase = require('../libs/clearDatabase');

module.exports = function() {

  return co(function*() {

    const args = require('yargs')
      .usage("gulp db:load --from fixtures/users")
      .demand(['from'])
      .describe('from', 'file to import')
      .argv;

    const dbPath = path.join(root, args.from);

    console.log("loading db " + dbPath);

    yield* clearDatabase();
    yield* loadModels(require(dbPath));

    console.log("loaded db " + dbPath);

    mongoose.disconnect();
  });

};
