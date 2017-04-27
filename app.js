'use strict';

// if (process.env.TRACE) {
  require('./libs/trace');
// }

const koa = require('koa');
const app = koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

app.keys = [config.secret];

const path = require('path');
const fs = require('fs');
const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

const Router = require('koa-router');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/users'
});

const User = require('./models/user');

router
  .param('userById', function*(id, next) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(404);
    }

    this.userById = yield User.findById(id);

    if (!this.userById) {
      this.throw(404);
    }

    yield* next;
  })
  .put('/', function*() {
    console.log(this.request.body);
    let user = yield User.create(pick(this.request.body, User.publicFields));
    this.status = 201;
    this.body = user.toObject();
  })
  .patch('/:userById', function*() {
    Object.assign(this.userById, pick(this.request.body, User.publicFields));
    yield this.userById.save();
    this.body = this.userById.toObject();
  })
  .get('/:userById', function*() {
    this.body = this.userById.toObject();
  })
  .del('/:userById', function*() {
    yield this.userById.remove();
    this.body = 'ok';
  })
  .get('/', function*() {
    let users = yield User.find({});

    this.body = users.map(user => user.toObject());
  });


app.use(router.routes());

module.exports = app;
