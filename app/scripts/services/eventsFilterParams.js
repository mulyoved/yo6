'use strict';

angular.module('yo6App')
	.factory('eventsFilterParams', function () {
		return {
			values: {
				date: 'Today',
				time: 'All Day',
				location: 'Tel-Aviv, Israel',
				search: ''
			}
		};
	});
