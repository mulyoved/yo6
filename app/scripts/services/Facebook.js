'use strict';

angular.module('yo6App')
  .factory('Facebook', function ($rootScope) {
	// Service logic
	// ...

	return {
		getLoginStatus:function () {
			console.log('Facebook getLoginStatus()');
			FB.getLoginStatus(function (response) {
				console.log('FB.getLoginStatus broadcast fb_statusChange (a9)');
				$rootScope.$broadcast('fb_statusChange', {'status':response.status});
			}, true);
		},
		login:function () {

			var fbScope = { scope: 'email,rsvp_event,user_events,friends_events,user_location,friends_location'};
			//was {scope:'read_stream, publish_stream, email'}

			console.log('Facebook login()');
			FB.getLoginStatus(function (response) {
				switch (response.status) {
				case 'connected':
					console.log('FB.login broadcast fb_connected (a1)');
					$rootScope.$broadcast('fb_connected', {facebook_id:response.authResponse /*.userID*/});
					break;
				case 'not_authorized' || 'unknown':
					// 'not_authorized' || 'unknown': doesn't seem to work
					FB.login(function (response) {
						if (response.authResponse) {
							console.log('FB.login broadcast fb_connected (a2)');
							$rootScope.$broadcast('fb_connected', {
								facebook_id:response.authResponse.userID,
								userNotAuthorized:true
							});
						} else {
							console.log('FB.login broadcast fb_login_failed (a3)');
							$rootScope.$broadcast('fb_login_failed');
						}
					}, fbScope);
					break;
				default:
					FB.login(function (response) {
						if (response.authResponse) {
							console.log('FB.login broadcast fb_connected (a4)');
							$rootScope.$broadcast('fb_connected', {facebook_id:response.authResponse /*.userID*/});
							console.log('FB.login broadcast fb_get_login_status');
							$rootScope.$broadcast('fb_get_login_status');
						} else {
							console.log('FB.login broadcast fb_login_failed (a5)');
							$rootScope.$broadcast('fb_login_failed');
						}
					}, fbScope);
					break;
				}
			}, true);
		},
		logout:function () {
			FB.logout(function (response) {
				if (response) {
					console.log('FB.logout broadcast fb_logout_succeded');
					$rootScope.$broadcast('fb_logout_succeded');
				} else {
					console.log('FB.logout broadcast fb_logout_failed');
					$rootScope.$broadcast('fb_logout_failed');
				}
			});
		},
		unsubscribe:function () {
			FB.api('/me/permissions', 'DELETE', function (response) {
				console.log('FB.unsubscribe broadcast fb_get_login_status');
				$rootScope.$broadcast('fb_get_login_status');
			});
		}
	};
});
