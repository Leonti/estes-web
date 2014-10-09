'use strict';

describe('Service: Order', function() {

	var Order;

	beforeEach(function() {
		module('estesWebApp', function($provide) {
			$provide.value('storage', {});
			$provide.value('Restangular', {});
		});

		inject(function(_Order_) {
			Order = _Order_;
		});
	});

	var order = {
		dishes : [ {
			price: "9",
			selectedIngredients : [
			                       {name: '', priceChange: "0.5"},
			                       {name: '', priceChange: "1.5"},
			                       {name: '', priceChange: "0"},
			                       {name: '', priceChange: "0.235"},
			                       ]
		} ]
	};

	it('should calculate price correctly', function() {
		expect(Order.calculatePrice(order)).toBe('11.24');
	});

});
