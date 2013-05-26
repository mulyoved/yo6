var util = require('util');
var inspect = util.inspect;
var db = {};

var mongoose = require('mongoose')
  , User = mongoose.model('User');

/*
 * POST auth routh
 */

exports.session = function(req, res) {
	console.log('auth/session (version 1.0.0.3) Req:%s', inspect(req.data))
	var session = req.session.user;
	console.log('auth/session Res:%s', inspect(session))
  	res.json(session)
};

exports.login = function(req, res) {
	var receivedData = req.body;
	console.log('auth/login %s', inspect(receivedData));

	if (receivedData && receivedData['userID'] && receivedData['accessToken']) {
		var userId = receivedData['userID'];
		db[userId] = receivedData;
		req.session.user = receivedData;
		console.log('auth/login save user: %s', userId);

		User
		.findOne({'userID': userId})
		.exec(function(err,user) {
	        if (err) console.error('failed to find user: %s', err);

	        if (!user) {
	        	user = new User({ userID:  userId});
	        }

			user.accessToken = receivedData['accessToken'];
			user.expireIn = receivedData['expireIn'];
			user.signedRequest = receivedData['signedRequest'];
			user.login = new Date().toISOString();

			user.save(function(err,user) {
				if (err) {
					console.error('failed to save user to database: %s', err);
				}
				else {
					console.log('saved user to database: %s', user.userID);
				}
			});
		});
	}
	else {				
		console.log('auth/login no facebook data');
	}
};

exports.logout = function(req, res) {
	var receivedData = req.body;
	console.log('auth/logout %s', inspect(receivedData));

	if (receivedData && receivedData['userID']) {
		var userId = receivedData['userID'];

		User
		.findOne({'userID': userId})
		.exec(function(err,user) {
	        if (err) console.error('failed to find user: %s', err);

	        if (!user) {
	        	console.error('logout unknown user');
	        }
	        else {
				user.logout = new Date().toISOString();

				user.save(function(err,user) {
					if (err) {
						console.error('failed to save user to database: %s', err);
					}
					else {
						console.log('saved user to database: %s', user.userID);
					}
				});
			}
		});

	}
	else {				
		console.log('auth/logout no facebook data');
	}

};