'use strict';

console.log('start db.js');
var mongoose = require( 'mongoose' );
var Mixed = mongoose.Schema.Types.Mixed;

mongoose.set('debug', false);


//User
var userSchema = new mongoose.Schema({
	userID: { type: Number, index: { unique: true , required: true}},
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

var Event = mongoose.model( 'User', userSchema );

Event.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})

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
	uid: { type: Number, index: { unique: true , required: true}},
	username: String,
	friends: [Number]
},
{ versionKey: false });

var fbUser = mongoose.model( 'fbUser', fbUserSchema );
fbUser.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})

var fbEvent = new mongoose.Schema({
	all_members_count: Number,
	attending_count: Number,
	can_invite_friends: Boolean,
	creator: Number,
	creator_cursor: String,
	declined_count: Number,
	description: String,
	eid: { type: Number, index: { unique: true , required: true}},
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


var fbEvent = mongoose.model( 'fbEvent', fbEvent );

fbEvent.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})

//Connect
console.log('call  mongoose.connect');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/yo6';

mongoose.connect( mongoUri );
var db = mongoose.connection;

db.on('error', function onError(err) {
	console.error('mongoose connection error: %s', err);
	process.exit(1);
});

db.once('open', function callback () {
	console.log('mogodb is connected');
});

console.log('completed db.js');
