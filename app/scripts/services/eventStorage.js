'use strict';

angular.module('yo6App')
.factory('eventStorage', function ($rootScope, $http) {
	var mockupUrl = 'mockup/fbevents_sample.json';
	var getOneUrl = '/event/';
	var getPageUrl = '/events/';
	var nextPage = 0;
	var filterValues = {};
	var itemStorage = {};

	var service = {
		items: [],
		busy: false,
		get: function(eid) {
			//todo: if not found then request it from server
			if (eid in itemStorage) {
				return itemStorage[eid];
			}
			else {
				if ($rootScope.config.useMockup) {
					return $http.get(mockupUrl)
					.then(function(data) {
						console.log('get one json - success: %s %s', eid,data);
						var newItems = data.data;
						for (var i = 0; i < newItems.length; i++) {
							console.log('search one json - success: %s', newItems[i].eid);
							if (newItems[i].eid === eid) {
								add(newItems[i]);
								return newItems[i];
							}
						}
					});
				}
				else {
					return $http.get(getOneUrl+eid)
					.then(function(data) {
						console.log('get one json - success: %s %s', eid,data.data);
						var newItems = data.data;
						add(newItems);
						return newItems;
					});
				}
			}
		},
		setFilter: function(_filterValues) {
			filterValues = _filterValues;
			clear();
		},
		loadNextPage: function() {
			if (!$rootScope.config.useMockup || service.items.length < 30) {
				console.log('load next page %s', service.items.length);
				if (service.busy) { return; }
				service.busy = true;

				//var url = 'http://api.reddit.com/hot?after=' + $scope.after + '&jsonp=JSON_CALLBACK';

				var url;
				if ($rootScope.config.useMockup) {
					url = mockupUrl;
				}
				else {
					url = getPageUrl+nextPage;
				}


				$http.get(url)
				.success(function(data) {
					console.log('json - success');
					var newItems = data;
					for (var i = 0; i < newItems.length; i++) {
						add(newItems[i]);
						service.items.push(newItems[i]);
					}
					//$scope.after = 't3_' + $scope.items[$scope.items.length - 1]._id;
					service.busy = false;
					nextPage++;
				})
				.error(function(data, status, headers, config) {
					console.log('loadNextPage - json - error');
				});

				console.log('completed load next page %s', service.items.length);
				return service.busy;
			}
		}
	};

	function clear() {
		service.items = [];
		itemStorage = {};
		nextPage = 0;
	}

	function add(event) {
		itemStorage[event.eid] = event;
	}
	return service;
});
