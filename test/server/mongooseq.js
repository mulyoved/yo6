'use strict';

var util = require('util');
var inspect = util.inspect;
var assert = require("assert")
var Q = require('../../server/node_modules/q');


//var mongoose = require('../../server/node_modules/mongoose');
var mongoose = require('../../server/node_modules/mongoose-q')();
// try catch needed to work with mocha --watch
var User;
try {
	var User = mongoose.model('User');
}
catch (e) {
	var db = require('../../server/models/db');
	var User = mongoose.model('User');
}

var u = {
	userID:  999999999,
	accessToken: 'TEST_accessToken',
	signedRequest: 'TEST_signedRequest'
};


function reportError(err) {
	console.error('Error: %s', err);
}


describe('Mongoose Q', function() {

	describe('Test', function() {
		it('delete any existing user', function(done) {
			User.remove({'userID': u.userID}, done);
		});

		it('Create User', function(done) {
			var user = new User({
				userID:  u.userID,
				accessToken: u.accessToken,
				expireIn: u.expireIn,
				signedRequest: u.signedRequest,
				testCounter: 0
			});

			//user.save(done);

			user.saveQ()
			//.spread(function (savedDoc, affectedRows) {
			//	console.log("save! %s %s", savedDoc, affectedRows);
			//})
			.then(function (result) {
				console.log("save! %s", result.userID);
			})
			.fail(function (err) {
				console.log("err %s", err);
			})
			.fin(done)
			.done();

		});

		it('FindQ', function(done) {
			User
			.findOne({'userID': u.userID})
			.execQ()
			.then(function(user) {
				if (user) {
					console.log('found user %s', user.userID);
				}
				else {
					console.log('user not found');
				}
			})
			.fail(reportError)
			.fin(done)
			.done();
		});

		it('Find - Change - Save', function(done) {
			User
			.findOne({'userID': u.userID})
			.execQ()
			.then(function(user) {
				if (user) {
					console.log('found user %s count: %d', user.userID, user.testCounter);
					user.testCounter = user.testCounter + 1;
					return user.saveQ();
				}
				else {
					console.log('user not found!');
				}
			})
			.then(function(user) {
				console.log('step2 user %s count: %d', user.userID, user.testCounter);

				user.testCounter = user.testCounter + 1;
				return user.saveQ();
			})
			.then(function (user) {
				console.log('step3 user %s count: %d', user.userID, user.testCounter);
			})
			.fail(reportError)
			.fin(function() {
				console.log('fin');
				done();
			})
			.done();
		});
	});
});

