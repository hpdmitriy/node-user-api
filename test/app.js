"use strict";

const app = require('../app');
const request = require('request-promise').defaults({
	resolveWithFullResponse: true,
	simple: false
});

const User = require('../models/user');

function getURL(path) {
	return `http://localhost:3000${path}`;
}

describe("User REST API", function () {

	before(function (done) {
		this.server = app.listen(3000, done);
	});

	after(function (done) {
		this.server.close(done);
	});

	let existingUserData = {
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita illum ullam error blanditiis impedit recusandae libero officia assumenda veritatis nihil nemo",
		name: "John",
		price: 100
	};
	let newUserData = {
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita illum ullam error blanditiis impedit recusandae libero officia",
		name: "Alice",
		price: 100
	};
	let existingUser;

	beforeEach(function*() {
		// load fixtures
		yield User.remove({});
		existingUser = yield User.create(existingUserData);
	});

	describe("PUT /users", function () {
		it("creates a user", function*() {
			let response = yield request({
				method: 'PUT',
				url: getURL('/users'),
				json: true,
				body: newUserData
			});
			response.body.name.should.eql(newUserData.name);
			response.body.description.should.eql(newUserData.description);
		});

		it("throws if description already exists", function*() {
			let response = yield request({
				method: 'PUT',
				url: getURL('/users'),
				json: true,
				body: existingUserData
			});
			response.statusCode.should.eql(400);
			response.body.errors.description.should.exist;
		});

		it("throws if description not valid", function*() {
			let response = yield request({
				method: 'PUT',
				url: getURL('/users'),
				json: true,
				body: {
					description: "invalid"
				}
			});
			response.statusCode.should.eql(400);
		});

	});

	describe("GET /user/:userById", function () {
		it("gets the user by id", function*() {
			let response = yield request.get(getURL('/users/' + existingUser._id));
			JSON.parse(response.body).description.should.exist;
			response.statusCode.should.eql(200);
			response.headers['content-type'].should.match(/application\/json/);
		});

		it("returns 404 if user does not exist", function*() {
			let response = yield request.get(getURL('/users/55b693486e02c26010ef0000'));
			response.statusCode.should.eql(404);
		});

		it("returns 404 if invalid id", function*() {
			let response = yield request.get(getURL('/users/kkkkk'));
			response.statusCode.should.eql(404);
		});
	});

	describe("DELETE /user/:userById", function () {
		it("removes user", function*() {
			let response = yield request.del(getURL('/users/' + existingUser._id));
			response.statusCode.should.eql(200);
			let users = yield User.find({}).exec();
			users.length.should.eql(0);
		});

		it("returns 404 if the user does not exist", function*() {
			let response = yield request.del(getURL('/users/55b693486e02c26010ef0000'));
			response.statusCode.should.eql(404);
		});
	});

	it("GET /users gets all users", function*() {
		let response = yield request.get(getURL('/users'));
		response.statusCode.should.eql(200);
		response.headers['content-type'].should.match(/application\/json/);
		JSON.parse(response.body).length.should.eql(1);
	});
});
