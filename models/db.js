'use strict';

console.log('start db.js');
var mongoose = require( 'mongoose' );
var Mixed = mongoose.Schema.Types.Mixed;

mongoose.set('debug', false);


//User
var userSchema = new mongoose.Schema({
	userID: Number,
	accessToken: String,
	longAaccessToken: String,
	expireIn: Number,
	signedRequest: String,
	login: { type: Date, default: Date.now },
	logout: { type: Date, default: '' },
	created: { type: Date, default: Date.now },
	testCounter: Number
},
{ versionKey: false });

mongoose.model( 'User', userSchema );

var Location = {
		street: String,
		city: String,
		state: String,
		country: String,
		zip: String,
		latitude: Number,
		longitude: Number,
		id: Number,
		name: String,
		located_in: Number
	};

//fbUser
var fbUserSchema = new mongoose.Schema({
	affiliations: [String],
	age_range: {
		min: Number,
		max: Number,
	},
	current_location: Location,
	first_name: String,
	friend_count: Number,
	last_name: String,
	locale: String,
	middle_name: String,
	mutual_friend_count: Number,
	name: String,
	name_format: String,
	pic: String,
	pic_big: String,
	pic_big_with_logo: String,
	pic_cover: String,
	pic_small: String,
	pic_small_with_logo: String,
	pic_square: String,
	pic_square_with_logo: String,
	pic_with_logo: String,
	profile_blurb: String,
	relationship_status: String,
	sex: String,
	sort_first_name: String,
	sort_last_name: String,
	subscriber_count: Number,
	timezone: Number,
	uid: Number,
	username: String,
	friends: [Number]
},
{ versionKey: false });

mongoose.model( 'fbUser', fbUserSchema );

var fbEvent = new mongoose.Schema({
	all_members_count: Number,
	attending_count: Number,
	can_invite_friends: Boolean,
	creator: Number,
	creator_cursor: String,
	declined_count: Number,
	description: String,
	eid: Number,
	end_time: String,
	has_profile_pic: Boolean,
	hide_guest_list: Boolean,
	host: String,
	is_date_only: Boolean,
	location: String,
	name: String,
	not_replied_count: Number,
	parent_group_id: String,
	pic: String,
	pic_big: String,
	pic_cover: {
		cover_id: Number,
		source: String,
		offset_y: Number,
		offset_x: Number
	},
	pic_small: String,
	pic_square: String,
	privacy: String,
	start_time: String,
	ticket_uri: String,
	timezone: String,
	unsure_count: Number,
	update_time: String,
	venue: Location,
	version: Number,
},
{ versionKey: false });


mongoose.model( 'fbEvent', fbEvent );


//Connect
console.log('call  mongoose.connect');
mongoose.connect( 'mongodb://localhost/yo6' );
var db = mongoose.connection;

db.on('error', function onError(err) {
	console.error('mongoose connection error: %s', err);
	process.exit(1);
});

db.once('open', function callback () {
	console.log('mogodb is connected');
});

console.log('completed db.js');
