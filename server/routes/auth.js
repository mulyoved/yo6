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

		//Save to mongoose
		user = new User({
			userID:  userId,
			accessToken: receivedData['accessToken'],
			expireIn: receivedData['expireIn'],
			signedRequest: receivedData['signedRequest']
		});
		console.log('auth/login mongoose user created: %s', user);

		user.save(function(err,user) {
			if (err) {
				console.error('failed to save user to database: %s', err);
			}
			else {
				console.log('saved user to database: %s', user.userID);
			}
		});
	}
	else {				
		console.log('auth/auth no facebook data');
	}
};

exports.logout = function(req, res) {
	var receivedData = req.body;
	console.log('auth/logout %s', inspect(receivedData));
};