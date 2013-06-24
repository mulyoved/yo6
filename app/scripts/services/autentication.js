'use strict';

angular.module('yo6App')
.factory('autentication', function (Facebook, $rootScope, $http) {
	$rootScope.isLoggedin = false;
	//var info;
	var userID;
	var userName = 'User';

	var service = {

		userName: function() {
			return userName;
		},

		init: function() {
			console.log('window.fbAsyncInit c1');
			window.fbAsyncInit = function () {
				console.log('window.fbAsyncInit %s', $rootScope.config.facebookAppId);

				FB.init({
					appId: $rootScope.config.facebookAppId,
					status: true,
					cookie: true,
					xfbml: true
				});

				console.log('window.fbAsyncInit a1');
				FB.getLoginStatus(function (response) {
					console.log('window.fbAsyncInit a2 ' + response.status);
					$rootScope.$broadcast('fb_statusChange', {'status':response.status});
				}, true);
				console.log('window.fbAsyncInit a3');
			};

			console.log('window.fbAsyncInit c2');
			(function (d) {
				console.log('window.fbAsyncInit b1');
				var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				if (d.getElementById(id)) {
					return;
				}
				console.log('window.fbAsyncInit b2');
				js = d.createElement('script');
				js.id = id;
				js.async = true;
				js.src = '//connect.facebook.net/en_US/all.js';
				console.log('window.fbAsyncInit b3');
				ref.parentNode.insertBefore(js, ref);
				console.log('window.fbAsyncInit b4');
			}(document));
			console.log('window.fbAsyncInit c3');
		},

		updateSession: function () {
			//reads the session variables if exist from php
			console.log('updateSession Going to Req');
			$http.post('auth/session').success(function (data) {
				//and transfers them to angular

				console.log('updateSession Res:');
				console.log(data);
				$rootScope.session = data;
			});
		},

		getLoginStatus: function () {
			console.log('MainCtrl getLoginStatus');
			Facebook.getLoginStatus();
		},

		login: function () {
			console.log('MainCtrl login');
			Facebook.login();
		},
		logout: function () {
			console.log('MainCtrl logout, %s', userID);
			Facebook.logout();
			$rootScope.session = {};
			//make a call to a php page that will erase the session data
			$http.post('auth/logout', { 'userID': userID });
		},
		unsubscribe: function () {
			Facebook.unsubscribe();
		},
		getInfo: function () {
			FB.api('/' + $rootScope.session.facebook_id, function (response) {
				console.log('Good to see you, ' + response.name + '.');
			});
			//service.info = $rootScope.session;
		}
	};


	$rootScope.$on('fb_statusChange', function (event, args) {
		$rootScope.fb_status = args.status;
		$rootScope.isLoggedin = args.status === 'connected';
		if (!$rootScope.isLoggedin) {
			userID = '';
		}

		console.log('onfb_statusChange %s', args.status);

		FB.api('/me', function(response) {
			userName = response.name;
			console.log('Good to see you, ' + response.name + '.');
			$rootScope.$apply();
		});
	});
	$rootScope.$on('fb_get_login_status', function () {
		console.log('on fb_get_login_status');
		Facebook.getLoginStatus();
	});
	$rootScope.$on('fb_login_failed', function () {
		console.log('fb_login_failed');
		Facebook.getLoginStatus();
	});
	$rootScope.$on('fb_logout_succeded', function () {
		console.log('fb_logout_succeded');
		Facebook.getLoginStatus();
		$rootScope.id = '';
	});
	$rootScope.$on('fb_logout_failed', function () {
		console.log('fb_logout_failed!');
		Facebook.getLoginStatus();
	});

	$rootScope.$on('fb_connected', function (event, args) {
		console.log('fb_connected event');
		/*
		 If facebook is connected we can follow two paths:
		 The users has either authorized our app or not.

		 ---------------------------------------------------------------------------------
		 http://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/

		 the user is logged into Facebook and has authenticated your application (connected)
		 the user is logged into Facebook but has not authenticated your application (not_authorized)
		 the user is not logged into Facebook at this time and so we don't know if they've authenticated
		 your application or not (unknown)
		 ---------------------------------------------------------------------------------

		 If the user is connected to facebook, his facebook_id will be enough to authenticate him in our app,
		 the only thing we will have to do is to post his facebook_id to 'php/auth.php' and get his info
		 from the database.

		 If the user has a status of unknown or not_authorized we will have to do a facebook api call to force him to
		 connect and to get some extra data we might need to unthenticated him.
		 */

		var params = {};

		function authenticateViaFacebook(parameters) {
			//posts some user data to a page that will check them against some db
			$http.post('auth/login', parameters).success(function () {
			});
		}

		if (args.userNotAuthorized === true) {
			//if the user has not authorized the app, we must write his credentials in our database

			//findme: mulyoved, I don't understand this how we can not authorized? maybe if user does not give permmisions?
			console.log('user is connected to facebook but has not authorized our app, not sure what to do with this');
			userID = '';

			/*
			FB.api(
				{
					method:'fql.multiquery',
					queries:{
						'q1':'SELECT uid, first_name, last_name FROM user WHERE uid = ' + args.facebook_id,
						'q2':'SELECT url FROM profile_pic WHERE width=800 AND height=800 AND id = ' + args.facebook_id
					}
				},
				function (data) {
					//let's built the data to send to php in order to create our new user
					params = {
						facebook_id:data[0]['fql_result_set'][0].uid,
						first_name:data[0]['fql_result_set'][0].first_name,
						last_name:data[0]['fql_result_set'][0].last_name,
						picture:data[1]['fql_result_set'][0].url
					}
					authenticateViaFacebook(params);
				});
*/
		}
		else {
			console.log('user is connected to facebook and has authorized our app: %s curent user (%s)', args.facebook_id.userID, userID);
			if (userID !== args.facebook_id.userID) {
				console.log(args.facebook_id);
				params = args.facebook_id;
				console.log('send server the user info: ' + params.userID);
				authenticateViaFacebook(params);
				userID = args.facebook_id.userID;
				console.log('After Send to server %s curent user (%s)', args.facebook_id.userID, userID);
			}
		}
	});

	return service;
});
