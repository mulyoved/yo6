'use strict';

var FBConfig = require("./fb_config").facebook;

var eventFields = 'all_members_count,attending_count,can_invite_friends,creator,creator_cursor,declined_count,description,eid,end_time,has_profile_pic,hide_guest_list,host,is_date_only,location,name,not_replied_count,parent_group_id,pic,pic_big,pic_cover,pic_small,pic_square,privacy,start_time,ticket_uri,timezone,unsure_count,update_time,venue,version';
var userFields = 'affiliations,age_range,current_location,first_name,friend_count,last_name,locale,middle_name,mutual_friend_count,name,name_format,pic,pic_big,pic_big_with_logo,pic_cover,pic_small,pic_small_with_logo,pic_square,pic_square_with_logo,pic_with_logo,profile_blurb,relationship_status,sex,sort_first_name,sort_last_name,subscriber_count,timezone,uid,username';


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

graph.setAccessToken(FBConfig.long_access_token);
graph.setOptions(options);


function compareDict(res, dict) {
  var data = res['data'][0];
  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (dict[key] == null) {
        assert(data[key], format('result %s should exists', key));
      }
      else {
        assert.equal(dict[key], data[key], format('compare result %s, Expected %s Got %s', key, dict[key], data[key]));
      }
    }
  }
}

function compareList(res, minSize, item) {
  var data = res['data'];

  assert(data);
  assert(data.length >= minSize, format('Array length %d min size %d of items %s', data.length, minSize, item));
  assert(data[0][item]);
  if (data.length > 1) {
    assert(data[1][item]);
  }
  assert(data[data.length-1][item]);
}

function fql(done, select, compare) {
  var saveArgs = arguments;

  graph
    .fql(select, function(err, res) {
      if (verbose) {
        console.log("Select: %s", select);
        console.log("Result: %s", inspect(res));
      }

      if (res['error']) {
        console.error("Error Result: %s", inspect(res));
        assert(false, format("FQL Return Error: %s", res['error']['message']));
      }
      else
      {
        var args = Array.prototype.splice.call(saveArgs, 0,3,res);
        compare.apply(null, saveArgs);

        done();
      }
    });
}


function f1() {
  console.log(arguments.length);
  console.log(inspect(arguments));

  var args = Array.prototype.splice.call(arguments, 0, 3, 99);
  console.log(arguments.length);
  console.log(inspect(arguments));
}


describe('fbgraph', function(){
  describe('query', function() {

    it.skip('Try', function(done) {
      f1(1,2,3,4,5,6);
      done();
    });

    it('batch query', function(done) {
      //debugger; this.timeout(0);
      var query = {
        mydetails: format('SELECT %s FROM user WHERE uid = me()', userFields),
        allfriends: 'SELECT uid2 FROM friend WHERE uid1 = me()'
      };

      fql(done, query, function(res) {
        console.log('BATCH Res: %s', inspect(res));
      });
    });

    it('get user info', function(done) {
      graph
        .get(FBConfig.me_id, function(err, res) {
          if (err) {
            console.log(res);
            done(err);
          }

          assert.equal(res['id'], FBConfig.me_id);
          assert.equal(res['first_name'], 'Muly');
          done();
        });
    });

    it('get my info - fql', function(done) {
      fql(done, format('SELECT %s FROM user WHERE uid = me()', userFields), 
        compareDict, 
        {
          current_location: null,
          last_name: null
        });
    });

    it('get user info - fql', function(done) {
      fql(done, format('SELECT %s FROM user WHERE uid = "%s"', userFields, FBConfig.uid), 
        compareDict, 
        {
          last_name: null,
          uid: FBConfig.uid
        });
    });

    it('get permissions', function(done) {
      fql(done, "SELECT email, user_about_me, user_birthday FROM permissions WHERE uid = me()",compareDict,
        { email: 1, user_birthday: 0});
    });

    it('get all permissions', function(done) {
      fql(done, "SELECT ads_management,bookmarked,create_event,create_note,email,export_stream,friends_about_me,friends_activities,friends_birthday,friends_checkins,friends_education_history,friends_events,friends_games_activity,friends_groups,friends_hometown,friends_interests,friends_likes,friends_location,friends_notes,friends_online_presence,friends_photo_video_tags,friends_photos,friends_questions,friends_relationship_details,friends_relationships,friends_religion_politics,friends_status,friends_subscriptions,friends_videos,friends_website,friends_work_history,manage_friendlists,manage_notifications,manage_pages,photo_upload,publish_actions,publish_checkins,publish_stream,read_friendlists,read_insights,read_mailbox,read_page_mailboxes,read_requests,read_stream,rsvp_event,share_item,sms,status_update,tab_added,uid,user_about_me,user_activities,user_birthday,user_education_history,user_events,user_games_activity,user_groups,user_hometown,user_interests,user_likes,user_location,user_notes,user_online_presence,user_photo_video_tags,user_photos,user_questions,user_relationship_details,user_relationships,user_religion_politics,user_status,user_subscriptions,user_videos,user_website,user_work_history,video_upload,xmpp_login,offline_access,user_checkins FROM permissions WHERE uid = me()",
        compareDict, { email: 1, user_birthday: 0, sms:0});
    });

    it('get all friends', function(done) {
      fql(done, 'SELECT uid2 FROM friend WHERE uid1 = me()', compareList,150,'uid2');
    });

    it('get my events', function(done) {
      fql(done, 'SELECT eid FROM event_member WHERE uid = me()',compareList,10,'eid')
    });

    it('get friend events', function(done) {
      fql(done, "SELECT eid FROM event_member WHERE uid = '100003980499676'",compareList,1,'eid')
    });

    it('get all friend events id', function(done) {
      this.timeout(10000);
      fql(done, "SELECT eid FROM event_member WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())",compareList,4200,'eid')
    });

    it('get event details', function(done) {
      //debugger;
      //this.timeout(0);

      fql(done, format("SELECT %s FROM event WHERE eid = '%s'", eventFields, FBConfig.eid),compareDict,
        { 
          eid: FBConfig.eid,
          name: null,
          description: null,
          all_members_count: null
        });
    });

    it.skip('get all events details', function(done) {
      //fail, sem like query is too long
      fql(done, format("SELECT %s FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()))", eventFields),
        compareList,100,'eid');
    });

    it('get all events details - my', function(done) {
      fql(done, format("SELECT %s FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid = me())", eventFields),
        compareList,20,'eid');
    });

    it('get 1 friend all events details', function(done) {
      this.timeout(10000);
      //https://www.facebook.com/echoEchoo
      fql(done, format("SELECT %s FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid = '%s')", eventFields, FBConfig.uid),
        compareList,20,'eid');
    });

  })
})
