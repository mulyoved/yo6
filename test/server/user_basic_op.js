'use strict';

var assert = require("assert")

describe('Mongoose Connection', function(){
  var db = require('../../server/models/db');
  var mongoose = require('../../server/node_modules/mongoose');
  var User = mongoose.model('User');

  var u = {
    userID:  999999999,
    accessToken: 'TEST_accessToken',
    signedRequest: 'TEST_signedRequest'
  };

  var fUser;

function confirmFields(expireIn) {
  return function(done) {
      assert(fUser);

      for (var key in u) {
        if (u.hasOwnProperty(key)) {
          //console.log('Compare %s', key);
          assert.equal(fUser[key], u[key]);
        }
      }

      if (expireIn) {
        assert.equal(fUser['expireIn'], expireIn);
      }
      else {
        assert.equal(fUser['expireIn'],null);
      }

      done();
    }
  }  

  describe('user', function() {
    it('delete any existing user', function(done) {
      User.remove({'userID': u.userID}, done);
    });

    it('save without error', function(done) {

      var user = new User({
        userID:  u['userID'],
        accessToken: u['accessToken'],
        expireIn: u['expireIn'],
        signedRequest: u['signedRequest']
      });


      user.save(done);
    });

    it('find', function(done) {
      fUser = null;

      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;
        done();
      })
    });

    it('find string', function(done) {
      fUser = null;

      User
      .findOne({'userID': '999999999'})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;
        done();
      })
    });

    it('confirm fields', confirmFields(0));

    it('change', function(done) {
      fUser.expireIn = 999;
      fUser.save(done);
    });

    it('confirm fields after change', confirmFields(999));

    it('update login date', function(done) {
      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;

        if (fUser) {
          fUser.login = new Date().toISOString();
          fUser.save(done)
        }
      })
    });

    it('check login date changed', function(done) {
      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;
        assert(user.login >= user.created);
        assert(user.logout < user.created);
        done();
      });
    });

    it('update logout date', function(done) {
      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;

        if (fUser) {
          fUser.logout = new Date().toISOString();
          fUser.save(done);
        }
      })
    });

    it('check logout date changed', function(done) {
      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        fUser = user;

        assert(user.login >= user.created);
        assert(user.logout >= user.created);
        done();
      });
    });

    it('delete', function(done) {
      User
      .findOne({'userID': u.userID})
      .remove(done);
    });

    it('not found', function(done) {
      fUser = null;

      User
      .findOne({'userID': u.userID})
      .exec(function(err,user) {
        if (err) done(err);
        assert.equal(user,null);
        done();
      })
    });

  })
})
