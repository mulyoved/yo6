'use strict';

var util = require('util');
var inspect = util.inspect;
var assert = require("assert")
var Q = require('../../server/node_modules/q');
var fs = require('fs');


//var mongoose = require('../../server/node_modules/mongoose');
var mongoose = require('../../server/node_modules/mongoose-q')();
if (mongoose.modelNames().length == 0) {
	var db = require('../../server/models/db');
}
var User = mongoose.model('User');
var fbUser = mongoose.model('fbUser');
var fbEvent = mongoose.model('fbEvent');

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

		it('Query fbEvent', function(done) {
			fbEvent
			.find()
			.limit(10)
			.execQ()
			.then(function(users) {
				if (users) {
					console.log('Found %d events', users.length);

					var ret = fs.writeFileSync('app/mockup/fbevents_sample.json', JSON.stringify(users, null, 4));
				}
				else {
					console.log('events not found');
				}
			})
			.fail(reportError)
			.fin(done)
			.done();
		});

		it('Read fbEvent mockup', function(done) {
			var ret = require('../../app/mockup/fbevents_sample.json'); 
			console.log('Found %d events', ret.length);
			done();
		});
	});
});

