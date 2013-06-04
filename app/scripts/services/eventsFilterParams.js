'use strict';

angular.module('yo6App')
	.factory('eventsFilterParams', function () {
		var values = {
			date: 'Today',
			time: 'All Day',
			location: 'Tel-Aviv, Israel',
			search: ''
		}

		return {
			getValues: function () {
				return values;
			},
			setValues: function (newValues) {
				console.log('set search values');
				values = newValues;
			}
		}
	});
