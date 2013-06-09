'use strict';

/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./models/db')
  , routes = require('./routes')
  , user = require('./routes/user')
  , auth = require('./routes/auth')
  , events = require('./routes/events')
  , http = require('http')
  , path = require('path');

var util = require('util');
var inspect = util.inspect;

var app = express();

// all environments
app.set('port', process.env.PORT || 9000);
//app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../app')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var appIndex = express.static(path.join(__dirname, '../app/index.html'));
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