'use strict';

var util = require('util');
var inspect = util.inspect;
var assert = require('assert');
var Q = require('q');
var graph = require('fbgraph');
var FBConfig = require('./fb_config').facebook;

//var verbose = false;

var options = {
	timeout:  25000,
	pool:     { maxSockets:  Infinity },
	headers:  { connection:  'keep-alive' }
};

graph.setAccessToken(FBConfig.long_access_token);
graph.setOptions(options);


var mongoose = require('mongoose');
if (mongoose.modelNames().length === 0) {
	require('../../models/db');
}
var User = mongoose.model('User');

var u = {
	userID:  999999999,
	accessToken: 'TEST_accessToken',
	signedRequest: 'TEST_signedRequest'
};


describe('Learn Q', function() {

	describe('basic', function() {
		it.skip('waterfall', function(done) {
			console.log('Call timeout water fall');

			setTimeout(function() {
				console.log('Call timeout -2');
				setTimeout(function() {
					console.log('Call timeout -1');
					setTimeout(function() {
						console.log('Timeout expired');
						done();
					}, 500);
				}, 500);
			}, 500);

			console.log('Call timeout returned');
		});

		it.skip('q-3', function(done) {
			this.timeout(0);
			console.log('Call q1');

			var promiseTimeout = function(timeout, expectedAnser) {
				var deferred = Q.defer();
				setTimeout(function() {
					console.log('Resolve');
					deferred.resolve(expectedAnser);
				}, timeout);
				return deferred.promise;
			};

			promiseTimeout(500, 2).
			then(function(p) {
				console.log('Call q2 %s', p);
				var inv = promiseTimeout(500, p+1);
				console.log('created inv %s', inv);
				return inv;
			}).
			then(function(p) {
				console.log('Call q3 %s', p);
				var inv = promiseTimeout(500, p+1);
				console.log('created inv %s', inv);
				return inv;
			}).
			then(function(p) {
				console.log('Call q4 %s', p);
				return p+1;
			}).
			then(function(p) {
				console.log('Call q5 %s', p);
				done();
			});
		});

		it('delete any existing user', function(done) {
		  User.remove({'userID': u.userID}, done);
		});

		it.skip('find with callback', function(done) {
			User
			.findOne({'userID': u.userID})
			.exec(function(err,user) {
				if (err) { done(err); }
				if (user) {
					console.log('found user');
				}
				else {
					console.log('not found user');
				}
				done();
			});
		});

		it.skip('find using Q', function(done) {
			var promis = function() {
				var deferred = Q.defer();
				User
				.findOne({'userID': '100001047971443'})
				.exec(function(err,user) {
					deferred.resolve(user);
				});
				return deferred.promise;
			};

			promis().then(function(p1, p2, p3) {
				console.log('Then %s %s %s', p1, p2, p3);
				done();
			});
		});

		it('find and save', function(done) {
			var qFind = Q.nfbind(User.findOne.bind(User));

			qFind({'userID': '100001047971442'})
			.then(function(user) {
				console.log('found user %s', user.userID);
				user.signedRequest = 129;

				var save = Q.nfbind(user.save.bind(user));
				var ret = save();
				console.log('Return %s', ret);
				return ret;
			})
			.then(function(_user) {
				var user = _user[0];
				assert.equal(user.userID, '100001047971442');
				console.log('Saved UserID %s', user.userID);
				done();
			})
			.fail(function (error) {
				console.error('Error %s', error);
				done();
			})
			.done();
		});

		it.skip('fql by Q', function(done) {
			//this.timeout(0);
			//debugger;
			console.log('fql');
			var select = 'SELECT name FROM user WHERE uid = me()';
			var qFql = Q.nbind(graph.fql, graph);

			//console.log('fql %s', qFql);

			/* old way
			graph
			.fql(select, function(err, res) {
				console.log('Select: %s', select);
				console.log('Result: %s', inspect(res));
				done();
			});
			*/

			qFql(select)
			.then(function(user) {
				console.log('Select: %s', inspect(user));
			})
			.fail(function (error) {
				console.error('Error %s', error);
			})
			.fin(done)
			.done();

		});

		it('join 2 promis', function(done) {
			var promiseTimeout = function(timeout, expectedAnser) {
				var deferred = Q.defer();
				setTimeout(function() {
					console.log('Resolve');
					deferred.resolve(expectedAnser);
				}, timeout);
				return deferred.promise;
			};

			var p1 = promiseTimeout(500,1);
			var p2 = promiseTimeout(500,2);
			var p = Q.all([p1, p2]);

			p
			.then(function(answer) {
				console.log('Answer: %s', answer);
			})
			.fail(function (error) {
				console.error('Error %s', error);
			})
			.fin(done)
			.done();
		});
	});
});

