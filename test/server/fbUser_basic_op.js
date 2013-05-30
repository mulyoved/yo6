'use strict';

var assert = require("assert")
var inspect = require('util').inspect;

var mongoose = require('../../server/node_modules/mongoose');
if (mongoose.modelNames().length == 0) {
	var db = require('../../server/models/db');
}
var User = mongoose.model('User');
var fbUser = mongoose.model('fbUser');

var fUser;
var uid = 99999999;

describe('Mongoose Connection', function(){

	describe('fbUser', function() {
		it('delete any existing user', function(done) {
			fbUser.remove({'uid': uid}, done);
		});

		it('save without error', function(done) {

			var user = new fbUser({
				uid:  uid,
			});

			//ok
			//user.age_range.min = 20;
			//user.age_range.max = 30;

			user.age_range = { min: 10, max:20 };

			user.friends = new Array();
			user.friends.push(1);
			user.friends.push(2);
			user.friends.push(3);
			user.friends.push(4);


			user.save(done);
		});

		it('update ', function(done) {
			fbUser
			.findOneAndUpdate( 
				{uid: uid},
				{age_range: { min: 20, max:30 }},
				{upsert: true},
				function(err, doc) {
					console.log('findOneAndUpdate %s', doc);
					done();
				}
			);

		});
	})
})
