'use strict';

describe('Service: Order', function() {

	var Order;

	beforeEach(function() {
		module('estesWebApp', function($provide) {
			$provide.value('storage', {
				set: function(name, value) {
						
				},
				get: function(name) {
				}
			});
			$provide.value('Restangular', {});
		});

		inject(function(_Order_) {
			Order = _Order_;
		});
	});

	var article = function () {
		return {
			price: '9',
			tax: '7',
			discount: '0',
			selectedOptions : [
			                       {name: '', priceChange: "0.5"},
			                       {name: '', priceChange: "1.5"},
			                       {name: '', priceChange: "0"},
			                       {name: '', priceChange: "0.235"},
			                       ]
		};
	};
	
	var order = {
		discount: '0',	
		articles : [ new article() ]
	};

	it('should calculate price correctly', function() {
		expect(Order.calculateArticlePrice(new article())).toBe('11.24');
		expect(Order.calculatePrice(order)).toBe('11.24');
		expect(Order.calculateTax(order)).toBe('0.79');
		expect(Order.calculateTotal(order)).toBe('12.02');
	});
	
	it('should calculate discounts correctly', function() {
		var articleWithDiscount = new article();
		articleWithDiscount.discount = '20';
		
		var orderWithDiscount = {
				discount: '10',	
				articles : [ articleWithDiscount ]				
		};
		
		expect(Order.calculateArticlePrice(articleWithDiscount)).toBe('11.24');
		expect(Order.calculateArticleDiscount(articleWithDiscount)).toBe('2.25');
		expect(Order.calculatePrice(orderWithDiscount)).toBe('8.99');
		expect(Order.calculateDiscount(orderWithDiscount)).toBe('0.90');
		expect(Order.calculateTax(orderWithDiscount)).toBe('0.57');
		expect(Order.calculateTotal(orderWithDiscount)).toBe('8.66');
	});

});
