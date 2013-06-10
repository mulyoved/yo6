'use strict';

/**
 * Module dependencies.
 */

var server = require('./app_create');
var port = process.env.VCAP_APP_PORT || 9000;

server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
