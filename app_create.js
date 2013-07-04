'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./models/db');
//var routes = require('./routes');
var auth = require('./routes/auth');
var events = require('./routes/events');
var http = require('http');
var path = require('path');

//var util = require('util');
//var inspect = util.inspect;

var app = express();

//app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '.tmp')));

var nodeEnv = process.env.NODE_ENV || 'development';
console.log('NODE_ENV = [%s]', nodeEnv);

// development only
if ('production' === nodeEnv) {
	console.log('Start server in production mode');
	app.use(express.errorHandler());
	//For now this seem not to find files
	app.use(express.static(path.join(__dirname, 'dist')));
	//app.use(express.static(path.join(__dirname, 'app')));
}
else {
	console.log('Start server in development mode');
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'app')));
}

var appIndex = express.static(path.join(__dirname, 'app/index.html'));
app.get('/', appIndex);
app.post('/auth/session', auth.session);
app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/event/:eid', events.eventOne);
app.get('/events/:page', events.eventsPage);

app.get('*', appIndex);

//app.error(raven.middleware.express('https://c4698c137bd0422f9f24635be2a5a90a:2b32df4f908b4ec98df2455b02d494f0@app.getsentry.com/9472'));

var server = http.createServer(app);
exports = module.exports = server;

//console.log('routes:%s', inspect(routes))
//console.log('static: %s', express.static(path.join(__dirname, '../app')));

exports.use = function() {
	app.use.apply(app, arguments);
};