'use strict';

var FBConfig = require("./fb_config").facebook;

var assert = require("assert");
var graph = require('../../server/node_modules/fbgraph');
var format = require('util').format;
var inspect = require('util').inspect;


//Full list, need more permmisions
//var userFields = 'affiliations,age_range,allowed_restrictions,can_message,can_post,currency,current_address,current_location,devices,email,email_hashes,first_name,friend_count,friend_request_count,has_timeline,install_type,is_app_user,is_blocked,last_name,locale,middle_name,mutual_friend_count,name,name_format,pic,pic_big,pic_big_with_logo,pic_cover,pic_small,pic_small_with_logo,pic_square,pic_square_with_logo,pic_with_logo,profile_blurb,profile_update_time,profile_url,relationship_status,search_tokens,security_settings,sex,shipping_information,sort_first_name,sort_last_name,subscriber_count,third_party_id,timezone,uid,username,verified,video_upload_limits,viewer_can_send_gift,wall_count,has_added_app';

var verbose = false;

var options = {
    timeout:  25000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};

graph.setAccessToken(FBConfig.access_token);
graph.setOptions(options);

describe('fbgraph', function(){
  describe('token', function() {

    it('request long term access_token', function(done) {
      //debugger; this.timeout(0);

      /*
      GET /oauth/access_token?  
          grant_type=fb_exchange_token&           
          client_id={app-id}&
          client_secret={app-secret}&
          fb_exchange_token={short-lived-token}       
      */

      ///oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}       
      graph.authorize(
        {
          grant_type: 'fb_exchange_token',
          client_id: '193911810758167',
          client_secret: '04d1c907e32ef66383c08d085100ef88',
          fb_exchange_token: FBConfig.access_token
        },
        function(err, res) {
          console.log('Err: %s', inspect(err));
          console.log('Res: %s', inspect(res));

          assert(res['access_token']);
          assert(res['expires']);

          done();
        });
    });

  })
})
