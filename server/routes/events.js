'use strict';

//var util = require('util');
//var inspect = util.inspect;

var mongoose = require('../../server/node_modules/mongoose-q')();
if (mongoose.modelNames().length === 0) {
	var db = require('../../server/models/db');
}
//var User = mongoose.model('User');
//var fbUser = mongoose.model('fbUser');
var fbEvent = mongoose.model('fbEvent');

function reportError(err) {
	console.error('Error: %s', err);
}

exports.eventOne = function(req, res) {
	var eid = req.params.eid;
	console.log('event/eid=%s', eid);

	fbEvent
	.findOne({eid: eid})
	.execQ()
	.then(function(e) {
		res.json(e);
	})
	.fail(reportError)
	.done();
};

exports.eventsPage = function(req, res) {
	var page = req.params.page;
	console.log('events/page=%s', page);

	var pageSize = 8;
	var from = pageSize * page;

	fbEvent
	.find()
	.skip(from)
	.limit(pageSize)
	.execQ()
	.then(function(users) {
		res.json(users);
	})
	.fail(reportError)
	.done();
};

