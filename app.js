'use strict';

/**
 * Module dependencies.
 */

var server = require('./app_create');
var port = process.env.PORT || 5000;

server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
