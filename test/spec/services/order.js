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

	var dish = function () {
		return {
			price: '9',
			tax: '0.07',
			discount: '0',
			selectedIngredients : [
			                       {name: '', priceChange: "0.5"},
			                       {name: '', priceChange: "1.5"},
			                       {name: '', priceChange: "0"},
			                       {name: '', priceChange: "0.235"},
			                       ]
		};
	};
	
	var order = {
		discount: '0',	
		dishes : [ new dish() ]
	};

	it('should calculate price correctly', function() {
		expect(Order.calculateDishPrice(new dish())).toBe('11.24');
		expect(Order.calculatePrice(order)).toBe('11.24');
		expect(Order.calculateTax(order)).toBe('0.79');
		expect(Order.calculateTotal(order)).toBe('12.02');
	});
	
	it('should calculate discounts correctly', function() {
		var dishWithDiscount = new dish();
		dishWithDiscount.discount = '0.2';
		
		var orderWithDiscount = {
				discount: '0.1',	
				dishes : [ dishWithDiscount ]				
		};
		
		expect(Order.calculateDishPrice(dishWithDiscount)).toBe('11.24');
		expect(Order.calculateDishDiscount(dishWithDiscount)).toBe('2.25');
		expect(Order.calculatePrice(orderWithDiscount)).toBe('8.99');
		expect(Order.calculateDiscount(orderWithDiscount)).toBe('0.90');
		expect(Order.calculateTax(orderWithDiscount)).toBe('0.57');
		expect(Order.calculateTotal(orderWithDiscount)).toBe('8.66');
	});

});
