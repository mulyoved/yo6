console.log('start db.js');
var mongoose = require( 'mongoose' );

mongoose.set('debug', true);

var userSchema = new mongoose.Schema({
	userID: String,
	accessToken: String,
	expireIn: Number,
	signedRequest: String,
	login: Date,
	logout: Date,
	created: Date
}, 
{ versionKey: false });

mongoose.model( 'User', userSchema );

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
