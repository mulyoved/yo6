'use strict';

var app = angular.module('yo6App');

app.controller('MainCtrl', function (Facebook, $scope, $rootScope, $http, $location) {

    console.log('module1');
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
	
    $rootScope.brand = 'Evnt7x24';
    $scope.events_date = 'Today';
    $scope.events_time = 'All Day';
    $scope.events_location = 'Tel-Aviv, Israel';

    $scope.info = {};
    $scope.isCollapsed = false;
    $scope.userID = '';

    //to avoid refresh and bliking parts pf the page need to make it 3 state, unitalized, true, false and hide both part if unitalized
    $scope.isLoggedin = true;

    $rootScope.$on("fb_statusChange", function (event, args) {
        $rootScope.fb_status = args.status;
        $rootScope.isLoggedin = args.status == 'connected';
        if (!$rootScope.isLoggedin) {
            $rootScope.userID = '';
        }

        console.log("onfb_statusChange");
        $rootScope.$apply();
    });
    $rootScope.$on("fb_get_login_status", function () {
        console.log("on fb_get_login_status");
        Facebook.getLoginStatus();
    });
    $rootScope.$on("fb_login_failed", function () {
        console.log("fb_login_failed");
        Facebook.getLoginStatus();
    });
    $rootScope.$on("fb_logout_succeded", function () {
        console.log("fb_logout_succeded");
        Facebook.getLoginStatus();
        $rootScope.id = "";
    });
    $rootScope.$on("fb_logout_failed", function () {
        console.log("fb_logout_failed!");
        Facebook.getLoginStatus();
    });

    $rootScope.$on("fb_connected", function (event, args) {
        console.log("fb_connected event");
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
                $scope.updateSession();
            });
        }

        if (args.userNotAuthorized === true) {
            //if the user has not authorized the app, we must write his credentials in our database

            //findme: mulyoved, I don't understand this how we can not authorized? maybe if user does not give permmisions?
            console.log("user is connected to facebook but has not authorized our app, not sure what to do with this");
            $scope.userID = '';

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
            console.log("user is connected to facebook and has authorized our app: %s curent user (%s)", args.facebook_id.userID, $rootScope.userID);
            if ($rootScope.userID != args.facebook_id.userID) {
                console.log(args.facebook_id);
                params = args.facebook_id;
                console.log("send server the user info: " + params.userID);
                authenticateViaFacebook(params);
                $rootScope.userID = args.facebook_id.userID;
                console.log("After Send to server %s curent user (%s)", args.facebook_id.userID, $rootScope.userID);
            }
        }

    });


    $rootScope.updateSession = function () {
        //reads the session variables if exist from php
        console.log("updateSession Going to Req");
        $http.post('auth/session').success(function (data) {
            //and transfers them to angular

            console.log("updateSession Res:");
            console.log(data);
            $rootScope.session = data;
        });
    };

    //$rootScope.updateSession();


    // button functions
    $scope.getLoginStatus = function () {
        console.log('MainCtrl getLoginStatus');
        Facebook.getLoginStatus();
    };

    $scope.login = function () {
        console.log('MainCtrl login');
        Facebook.login();
    };

    $scope.logout = function () {
        console.log('MainCtrl logout, %s', $rootScope.userID);
        Facebook.logout();
        $rootScope.session = {};
        //make a call to a php page that will erase the session data
        $http.post("auth/logout", { 'userID': $rootScope.userID });
    };

    $scope.unsubscribe = function () {
        Facebook.unsubscribe();
    }

    $scope.getInfo = function () {
        FB.api('/' + $rootScope.session.facebook_id, function (response) {
            console.log('Good to see you, ' + response.name + '.');
        });
        $rootScope.info = $rootScope.session;

    };

    $scope.setEventsTime = function (time) {
        console.log('setEventsTime, ' + time);
        $rootScope.events_time = time;
    }

})
.controller('EventsController', function($scope, $http) {
    console.log('EventsController');
    $scope.items = [];
    $scope.busy = false;
    $scope.after = '';

    $scope.loadEvents = function() {
        if ($scope.items.length < 30) {
            console.log('next page');
            if ($scope.busy) return;
            $scope.busy = true;

            var url = "mockup/fbevents_sample.json";
            //var url = "http://api.reddit.com/hot?after=" + $scope.after + "&jsonp=JSON_CALLBACK";
            $http.get(url)
            .success(function(data) {
                console.log('json - success');
                var items = data;
                for (var i = 0; i < items.length; i++) {
                    $scope.items.push(items[i]);
                }
                //$scope.after = "t3_" + $scope.items[$scope.items.length - 1]._id;
                $scope.busy = false;
            })
            .error(function(data, status, headers, config) {
                console.log('json - error');
            });
        }
    };
});

app.controller('EventDetailController', function($scope, $routeParams) {
    $scope.eid = $routeParams.eid;
});

app.controller('DemoController', function($scope) {
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.images.push(last + i);
    }
  };
});

