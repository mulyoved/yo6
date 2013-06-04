'use strict';

angular.module('yo6App')
.factory('eventStorage', function () {

	var itemStorage = {};
	return {
		add: function (event) {
			itemStorage[event.eid] = event;
		},
		get: function(eid) {
			//todo: if not found then request it from server
			return itemStorage[eid];
		}
	};
});
