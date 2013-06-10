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

// all environments
app.set('port', process.env.VCAP_APP_PORT || 9000);

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

// development only
if ('development' === app.get('env')) {
	console.log('Start server in development mode');
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'app')));
}
else {
	console.log('Start server in dist mode');
	//app.use(express.static(path.join(__dirname, 'dist')));
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

var server = http.createServer(app);
exports = module.exports = server;

//console.log('routes:%s', inspect(routes))
//console.log('static: %s', express.static(path.join(__dirname, '../app')));

exports.use = function() {
	app.use.apply(app, arguments);
};