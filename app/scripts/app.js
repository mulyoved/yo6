'use strict';

var app = angular.module('yo6App', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/tlogin', {
        templateUrl: 'views/tlogin.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function ($rootScope) {
    console.log('app.run');
    window.fbAsyncInit = function () {
        console.log('window.fbAsyncInit');

        FB.init({
            appId:'193911810758167',
            status:true,
            cookie:true,
            xfbml:true
        });

        console.log('window.fbAsyncInit a1');
        FB.getLoginStatus(function (response) {
                console.log('window.fbAsyncInit a2 ' + response.status);
                $rootScope.$broadcast("fb_statusChange", {'status':response.status});
            }, true);
        console.log('window.fbAsyncInit a3');
    };

    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

	/*
    FB.Event.subscribe('auth.statusChange', function(response) {
        $rootScope.$broadcast("fb_statusChange", {'status': response.status});
    });
	*/
});
