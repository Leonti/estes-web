'use strict';
/*global _,Big:false */

angular.module('estesWebApp').factory('Goods', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function formatTax(tax) {
		return new Big(tax).times(new Big(100)).toString();
	}
	
	function parseTax(tax) {
		return new Big(tax).div(new Big(100)).toString();
	}
	
	function GoodsMock($q, storage) {

		function generateFakeGroups() {
			var groups = [];
			
			groups.push({
				name: 'Tax Group 1',
				tax: '0.71',
				goods: generateFakeGoods(1)
			});
			
			groups.push({
				name: 'Tax Group 2',
				tax: '0.58',
				goods: generateFakeGoods(21)
			});
			
			groups.push({
				name: 'Tax Group 3',
				tax: '0.43',
				goods: generateFakeGoods(41)
			});
			
			return groups;
		}
		
		function generateFakeGoods(baseI) {
			var goods = [];
			
			for (var i = baseI; i < baseI + 20; i++) {
				goods.push({
					name: 'article_' + i,
					price: '5.25',
					tags: ['kitchen', 'household']
				});
			}
			
			return goods;
		}
		
		if (!storage.get('mockGoods')) {
			storage.set('mockGoods', generateFakeGroups());
		}		
		
		return {
			readGroups: function() {
				return $q.when(angular.copy(storage.get('mockGoods')));
			},
			saveGroups: function(groups) {
				return $q.when(storage.set('mockGoods', groups));
			},
			formatTax: formatTax,
			parseTax: parseTax
		};
	}
	
	function Goods(Rest, Restangular) {
		
	}

	if (Demo.isEnabled()) {
		return new GoodsMock($q, storage);
	} else {
		return new Goods(Rest, Restangular);
	}	
	
}]);
