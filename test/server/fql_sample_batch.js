'use strict';

var FBConfig = require("./fb_config").facebook;

var eventFields = 'all_members_count,attending_count,can_invite_friends,creator,creator_cursor,declined_count,description,eid,end_time,has_profile_pic,hide_guest_list,host,is_date_only,location,name,not_replied_count,parent_group_id,pic,pic_big,pic_cover,pic_small,pic_square,privacy,start_time,ticket_uri,timezone,unsure_count,update_time,venue,version';
var userFields = 'affiliations,age_range,current_location,first_name,friend_count,last_name,locale,middle_name,mutual_friend_count,name,name_format,pic,pic_big,pic_big_with_logo,pic_cover,pic_small,pic_small_with_logo,pic_square,pic_square_with_logo,pic_with_logo,profile_blurb,relationship_status,sex,sort_first_name,sort_last_name,subscriber_count,timezone,uid,username';


var assert = require("assert");
var graph = require('../../server/node_modules/fbgraph');
var format = require('util').format;
var inspect = require('util').inspect;
var Q = require('../../server/node_modules/q');

var mongoose = require('../../server/node_modules/mongoose-q')();
if (mongoose.modelNames().length == 0) {
	var db = require('../../server/models/db');
}
var User = mongoose.model('User');
var fbUser = mongoose.model('fbUser');
var fbEvent = mongoose.model('fbEvent');

//Full list, need more permmisions
//var userFields = 'affiliations,age_range,allowed_restrictions,can_message,can_post,currency,current_address,current_location,devices,email,email_hashes,first_name,friend_count,friend_request_count,has_timeline,install_type,is_app_user,is_blocked,last_name,locale,middle_name,mutual_friend_count,name,name_format,pic,pic_big,pic_big_with_logo,pic_cover,pic_small,pic_small_with_logo,pic_square,pic_square_with_logo,pic_with_logo,profile_blurb,profile_update_time,profile_url,relationship_status,search_tokens,security_settings,sex,shipping_information,sort_first_name,sort_last_name,subscriber_count,third_party_id,timezone,uid,username,verified,video_upload_limits,viewer_can_send_gift,wall_count,has_added_app';

var verbose = false;

var options = {
	timeout:  25000
	, pool:     { maxSockets:  Infinity }
	, headers:  { connection:  "keep-alive" }
};

graph.setAccessToken(FBConfig.long_access_token);
graph.setOptions(options);
var qFql = Q.nbind(graph.fql, graph);


function saveEvents(user_events) {
	var promiseArray = [];
	var len = user_events.length;
	for (var i = 0; i < len; i++) {
		var e = user_events[i];

		var p = fbEvent.findOneAndUpdate(
					{eid: e.eid},
					e,
					{upsert: true})
				.execQ();

		promiseArray.push(p);
	}

	return Q.all(promiseArray);
}

describe('fbgraph', function(){
	describe('batch query', function() {
	// Design

	// Batch Step 1
	// Mongo: Get Saved fbUser
	// FQL: Get user info
	// FQL: Get user friends
	// FQL: Get user events
	// 
	// Batch Step 2
	// Mongo: Save/Update user + friends
	// Mongo: Save user events
	// FQL: Foreach friend, optionaly batch in group of x 10 get Events 
	//   
	// Batch 3
	// Mongo: Save Events Details

		it('start', function(done) {
			this.timeout(0);

			var query1 = {
				user_info: format('SELECT %s FROM user WHERE uid = %d', userFields, FBConfig.me_id),
				user_friends: format('SELECT uid2 FROM friend WHERE uid1 = %d', FBConfig.me_id),
				user_events: format("SELECT %s FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid = %d)", eventFields, FBConfig.me_id)
			}

			var getUser =       
			fbUser
			.findOne({'uid': FBConfig.me_id})
			.execQ();

			var fql = qFql(query1);

			var step1 = Q.all([getUser, fql]);

			step1
			.then(function(answer) {
				debugger;

				var user = answer[0];
				var batchData = answer[1].data;

				for (var i = 0; i < batchData.length; i++) {
					var item = batchData[i];

					var name = item.name;
					var data = item.fql_result_set;

					if (name == 'user_info') {
						var user_info = data[0];
					}
					else if (name == 'user_friends') {
						var user_friends = data;
					}
					else if (name == 'user_events') {
						var user_events = data;
					}
				}

				var promiseArray = [];
				if (!user) {
					user = new fbUser();
				}

				for (var key in user_info) {
					if (user_info.hasOwnProperty(key)) {
						user[key] = user_info[key];
					}
				}

				promiseArray.push(user.saveQ());
				promiseArray.push(saveEvents(user_events));

				user.friends = new Array();
				var query2 = {};
				var len = user_friends.length;
				for (var i = 0; i < len; i++) {
					var uid2 = user_friends[i].uid2;
					user.friends.push(uid2);

					if (Object.keys(query2).length >= 20) {
						promiseArray.push(qFql(query2));
						var query2 = {};
					}
					query2[uid2] = format("SELECT %s FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid = %d)", eventFields, uid2)
				}

				//console.log('Query2 %s', inspect(query2));
				promiseArray.push(qFql(query2));

				var step2 = Q.all(promiseArray);
				return step2;
			})
			.then(function(answer) {
				// answer, 2 1st items are the mongo saving all the rest are fql answers 

				console.log('Step2 completed %s', answer.length);
				debugger;

				var promiseArray = [];
				var len = answer.length;
				for (var i = 2; i < len; i++) {
					var batchData = answer[i].data;
					var lenData = batchData.length;
					for (var j = 0; j < lenData; j++) {
						var data = batchData[j];
						var uid = data.name;
						var user_events = data.fql_result_set;

						promiseArray.push(saveEvents(user_events));
					}
				}

				var step3 = Q.all(promiseArray);
				return step3;
			})
			.then(function(answer) {
				console.log('Step3 completed %s', answer.length);
				debugger;
			})
			.fail(function (error) {
				debugger;
				console.error('Batch Operation Failed Error %s', error);
				console.error('Batch Operation Failed Stack %s', error.stack);
			})
			.fin(done)
			.done();

			/*
			graph
			.fql(query1, function(err, res) {
				console.log('BATCH Res: %s', inspect(res));

				debugger;
				var _data = res.data;
			  //console.log('data: %s', inspect(_data));

			  for (var i = 0; i < _data.length; i++) {
				var item = _data[i];
				//console.log('item: %s', inspect(item));

				var name = item.name;
				var data = item.fql_result_set;

				//console.log('data: %s = %s', name, data);
				if (name == 'user_info') {
					var uid = data.uid;
				  //fbUser.findOne({uid: uid}).

			  }
			  else if (name == 'user_friends') {

			  }
			  else if (name == 'user_events') {

			  }
			  */
		});
	});
})